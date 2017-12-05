import { Actions, SOURCE_SUBSCRIBE, SOURCE_UNSUBSCRIBE,
  SOURCE_START_LOAD, SOURCE_STOP_LOAD, ENTRY_MARK_SEEN } from './actions';
import * as LRU from 'lru-cache';

import NewsSource from './NewsSource';
import NewsEntry, { NewsEntryIdentifier } from './NewsEntry';

export type State = {
  subscribedSources: {
    [sourceIdentifier: string]: NewsSource,
  };
  sourceEntries: {
    [sourceIdentifier: string]: NewsEntryIdentifier[],
  }
  entries: {
    [entryIdentifier: string]: NewsEntry,
  }
  seenItems: LRU.Cache<NewsEntryIdentifier, boolean>;
};

type SerializedState = {
  subscribedSources: string[];
  seenItems: Array<LRU.LRUEntry<NewsEntryIdentifier, boolean>>
};

const localStorageKey = 'new_news_1';
const getSerializedState = (): SerializedState | undefined => {
  const jsonString = window.localStorage[localStorageKey];
  if (jsonString) {
    return JSON.parse(jsonString);
  } else {
    return undefined;
  }
};
const serialize = (state: State) => {
  const serializedState: SerializedState = {
    subscribedSources: Object.keys(state.subscribedSources),
    seenItems: state.seenItems.dump(),
  };
  window.localStorage[localStorageKey] = JSON.stringify(serializedState);
};

const initialSerializedState = getSerializedState() || {
  subscribedSources: ['reddit:movies', 'reddit:politics', 'hackernews'],
  seenItems: [],
};

const initialSubscribedSources = initialSerializedState.subscribedSources.reduce(
  (acc, id) => {
    acc[id] = new NewsSource(id, false, false);
    return acc;
  },
  {},
);

const initialLRU = LRU<NewsEntryIdentifier, boolean>();
initialLRU.load(initialSerializedState.seenItems);

export const initialState: State = {
  subscribedSources: initialSubscribedSources,
  sourceEntries: {},
  entries: {},
  seenItems: initialLRU,
};

const reducer =
(state = initialState, action: Actions[keyof Actions]) => {
  switch (action.type) {
    case SOURCE_SUBSCRIBE: {
      const identifier = action.sourceIdentifier;
      state.subscribedSources[identifier] = new NewsSource(identifier, false, false);
      serialize(state);
      return Object.assign({}, state);
    }
    case SOURCE_UNSUBSCRIBE: {
      serialize(state);
      return state;
    }
    case SOURCE_START_LOAD: {
      const identifier = action.sourceIdentifier;      
      state.subscribedSources[identifier] = new NewsSource(identifier, true, false);
      return Object.assign({}, state);
    }
    case SOURCE_STOP_LOAD: {
      const identifier = action.sourceIdentifier;      
      state.subscribedSources[identifier] = new NewsSource(identifier, false, true);
      const unseenEntries = action.entries.filter((entry) => {
        return !state.seenItems.get(entry.id);
      });
      state.sourceEntries[identifier] = unseenEntries.map(e => e.id);
      unseenEntries.forEach((entry) => {
        state.entries[entry.id] = entry;
      });
      
      return Object.assign({}, state);
    }
    case ENTRY_MARK_SEEN: {
      state.seenItems.set(action.identifier, true);
      serialize(state);   
      return Object.assign({}, state);
    }
    default:
    return Object.assign({}, state);
  }
};
export default reducer;