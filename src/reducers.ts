import {
  ENTRY_MARK_SEEN,
  EntryScrollCheckCallbackType,
  IActions,
  NIGHT_MODE_SET,
  SCROLL_CALLBACK_ADD,
  SERVER_INITIALIZED,
  SOURCE_START_LOAD,
  SOURCE_STOP_LOAD,
  SOURCE_SUBSCRIBE,
  SOURCE_UNSUBSCRIBE
} from "./actions";

import LRU from "lru-cache";

import NewsEntry, { NewsEntryIdentifier } from "./NewsEntry";
import NewsSource from "./NewsSource";

import server, { ISerializedState } from "./server";

export type EntryScrollCheckCallback = EntryScrollCheckCallbackType;

export interface IState {
  subscribedSources: {
    [sourceIdentifier: string]: NewsSource;
  };
  sourceEntries: {
    [sourceIdentifier: string]: NewsEntryIdentifier[];
  };
  entries: {
    [entryIdentifier: string]: NewsEntry;
  };
  seenItems: LRU.Cache<NewsEntryIdentifier, boolean>;
  scrollCallbacks: EntryScrollCheckCallback[];
  serverInitialized: boolean;
  nightMode: boolean;
}

const serialize = (state: IState) => {
  const serializedState: ISerializedState = {
    seenItems: state.seenItems.dump(),
    subscribedSources: Object.keys(state.subscribedSources)
  };
  server.serverSavingLocally = true;
  server.save(serializedState);
  server.serverSavingLocally = false;
};

const deserialize = (serializedState: ISerializedState) => {
  const seenItems = LRU<NewsEntryIdentifier, boolean>({
    max: 500
  });
  seenItems.load(serializedState.seenItems);

  const subscribedSources = serializedState.subscribedSources.reduce(
    (acc, id) => {
      acc[id] = new NewsSource(id, false, false);
      return acc;
    },
    {}
  );

  return { seenItems, subscribedSources };
};

const initialSerializedState = {
  seenItems: [],
  subscribedSources: ["reddit:movies", "reddit:politics", "hackernews", "cnn"]
};

export const initialState: IState = {
  entries: {},
  nightMode: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches),
  scrollCallbacks: [],
  seenItems: deserialize(initialSerializedState).seenItems,
  serverInitialized: false,
  sourceEntries: {},
  subscribedSources: deserialize(initialSerializedState).subscribedSources
};

const reducer = (state = initialState, action: IActions[keyof IActions]) => {
  switch (action.type) {
    case SERVER_INITIALIZED: {
      const serializedState = action.serializedState;
      if (serializedState) {
        const deserialized = deserialize(serializedState);
        state.seenItems = deserialized.seenItems;
        state.subscribedSources = deserialized.subscribedSources;
      }
      return { ...state, serverInitialized: true };
    }
    case SOURCE_SUBSCRIBE: {
      const identifier = action.sourceIdentifier;
      state.subscribedSources[identifier] = new NewsSource(
        identifier,
        false,
        false
      );
      serialize(state);
      return { ...state };
    }
    case SOURCE_UNSUBSCRIBE: {
      serialize(state);
      return { ...state };
    }
    case SOURCE_START_LOAD: {
      const identifier = action.sourceIdentifier;
      state.subscribedSources[identifier] = new NewsSource(
        identifier,
        true,
        false
      );
      return { ...state };
    }
    case SOURCE_STOP_LOAD: {
      const identifier = action.sourceIdentifier;
      state.subscribedSources[identifier] = new NewsSource(
        identifier,
        false,
        true
      );
      const unseenEntries = action.entries.filter(entry => {
        return !state.seenItems.get(entry.id);
      });
      state.sourceEntries[identifier] = unseenEntries.map(e => e.id);
      unseenEntries.forEach(entry => {
        state.entries[entry.id] = entry;
      });

      return { ...state };
    }
    case ENTRY_MARK_SEEN: {
      action.identifiers.forEach(identifier => {
        state.seenItems.set(identifier, true);
      });
      serialize(state);
      return { ...state };
    }
    case SCROLL_CALLBACK_ADD: {
      state.scrollCallbacks.push(action.callback);
      return { ...state };
    }
    case NIGHT_MODE_SET: {
      return { ...state, nightMode: action.nightMode };
    }
    default:
      return { ...state };
  }
};
export default reducer;
