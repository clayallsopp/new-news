import { Reducer } from 'redux';
import { Actions, SUBSCRIBE_SOURCE } from './actions';
import * as LRU from 'lru-cache';

import { NewsSourceIdentifier } from './NewsSource';
import NewsEntry from './NewsEntry';

export type State = {
  subscribedSources: Partial<{
    [id in NewsSourceIdentifier]: NewsEntry[];
  }>;

  seenItems: LRU.Cache<string, boolean>;
};

export const initialState: State = {
  subscribedSources: {},
  seenItems: LRU(),
};

const reducer: Reducer<State> =
(state = initialState, action: Actions[keyof Actions]) => {
  switch (action.type) {
    case SUBSCRIBE_SOURCE:
      return state;
    default: return state;
  }
};
export default reducer;
