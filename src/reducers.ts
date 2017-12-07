import {
  ENTRY_MARK_SEEN,
  EntryScrollCheckCallback,
  IActions,
  SCROLL_CALLBACK_ADD,
  SOURCE_START_LOAD,
  SOURCE_STOP_LOAD,
  SOURCE_SUBSCRIBE,
  SOURCE_UNSUBSCRIBE
} from "./actions";

import * as LRU from "lru-cache";

import NewsEntry, { NewsEntryIdentifier } from "./NewsEntry";
import NewsSource from "./NewsSource";

export type EntryScrollCheckCallback = EntryScrollCheckCallback;

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
}

interface ISerializedState {
  subscribedSources: string[];
  seenItems: Array<LRU.LRUEntry<NewsEntryIdentifier, boolean>>;
}

const localStorageKey = "new_news_1";
const getSerializedState = (): ISerializedState | undefined => {
  const jsonString = window.localStorage[localStorageKey];
  if (jsonString) {
    return JSON.parse(jsonString);
  } else {
    return undefined;
  }
};
const serialize = (state: IState) => {
  const serializedState: ISerializedState = {
    seenItems: state.seenItems.dump(),
    subscribedSources: Object.keys(state.subscribedSources)
  };
  window.localStorage[localStorageKey] = JSON.stringify(serializedState);
};

const initialSerializedState = getSerializedState() || {
  seenItems: [],
  subscribedSources: ["reddit:movies", "reddit:politics", "hackernews"]
};

const initialSubscribedSources = initialSerializedState.subscribedSources.reduce(
  (acc, id) => {
    acc[id] = new NewsSource(id, false, false);
    return acc;
  },
  {}
);

const initialLRU = LRU<NewsEntryIdentifier, boolean>();
initialLRU.load(initialSerializedState.seenItems);

export const initialState: IState = {
  entries: {},
  scrollCallbacks: [],
  seenItems: initialLRU,
  sourceEntries: {},
  subscribedSources: initialSubscribedSources
};

const reducer = (state = initialState, action: IActions[keyof IActions]) => {
  switch (action.type) {
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
    default:
      return { ...state };
  }
};
export default reducer;
