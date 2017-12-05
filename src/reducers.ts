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

export const initialState: State = {
  subscribedSources: {
    'reddit:movies': new NewsSource('reddit:movies', false, false),
    'reddit:politics': new NewsSource('reddit:politics', false, false),    
  },
  sourceEntries: {},
  entries: {},
  seenItems: LRU(),
};

const reducer =
(state = initialState, action: Actions[keyof Actions]) => {
  switch (action.type) {
    case SOURCE_SUBSCRIBE: {
      const identifier = action.sourceIdentifier;
      state.subscribedSources[identifier] = new NewsSource(identifier, false, false);
      return Object.assign({}, state);
    }
    case SOURCE_UNSUBSCRIBE:
      return state;
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
      return Object.assign({}, state);
    }
    default:
    return Object.assign({}, state);
  }
};
export default reducer;
