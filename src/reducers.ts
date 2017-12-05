import { Actions, SOURCE_SUBSCRIBE, SOURCE_UNSUBSCRIBE,
  SOURCE_START_LOAD, SOURCE_STOP_LOAD, ENTRY_MARK_SEEN, WINDOW_SCROLL_SET } from './actions';
import * as LRU from 'lru-cache';

import NewsSource from './NewsSource';
import NewsEntry, { NewsEntryIdentifier } from './NewsEntry';

export type State = {
  subscribedSources: {
    [sourceIdentifier: string]: NewsSource,
  };
  sourceEntries: {
    [sourceIdentifier: string]: NewsEntry[],
  }
  seenItems: LRU.Cache<NewsEntryIdentifier, boolean>;
  currentScrollOffset: number;
};

export const initialState: State = {
  subscribedSources: {
    'reddit:movies': new NewsSource('reddit:movies', false, false),
    'reddit:politics': new NewsSource('reddit:politics', false, false),    
  },
  sourceEntries: {},
  seenItems: LRU(),
  currentScrollOffset: 0,
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
      state.sourceEntries[identifier] = action.entries.filter((entry) => {
        return !state.seenItems.get(entry.id);
      });
      return Object.assign({}, state);
    }
    case ENTRY_MARK_SEEN:
      return state;
    case WINDOW_SCROLL_SET: {
      state.currentScrollOffset = action.scroll;
      return Object.assign({}, state);
    }
    default:
    return Object.assign({}, state);
  }
};
export default reducer;
