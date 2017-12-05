import { NewsSourceIdentifier } from './NewsSource';
import NewsEntry, { NewsEntryIdentifier } from './NewsEntry';

export const SOURCE_SUBSCRIBE = 'SOURCE_SUBSCRIBE';
export const SOURCE_UNSUBSCRIBE = 'SOURCE_UNSUBSCRIBE';
export const SOURCE_START_LOAD = 'SOURCE_START_LOAD';
export const SOURCE_STOP_LOAD = 'SOURCE_STOP_LOAD';
export const ENTRY_MARK_SEEN = 'ENTRY_MARK_SEEN';

export type Actions = {
  SOURCE_SUBSCRIBE: {
    type: typeof SOURCE_SUBSCRIBE,
    sourceIdentifier: NewsSourceIdentifier,
  },
  SOURCE_UNSUBSCRIBE: {
    type: typeof SOURCE_UNSUBSCRIBE,
    sourceIdentifier: NewsSourceIdentifier,
  },
  SOURCE_START_LOAD: {
    type: typeof SOURCE_START_LOAD,
    sourceIdentifier: NewsSourceIdentifier,    
  },
  SOURCE_STOP_LOAD: {
    type: typeof SOURCE_STOP_LOAD,
    sourceIdentifier: NewsSourceIdentifier,   
    entries: NewsEntry[], 
  },
  ENTRY_MARK_SEEN: {
    type: typeof ENTRY_MARK_SEEN,
    identifier: NewsEntryIdentifier;
  },
};

export const actionCreators = {
  subscribeToSource: (sourceIdentifier: NewsSourceIdentifier): Actions[typeof SOURCE_SUBSCRIBE] => ({
    type: SOURCE_SUBSCRIBE,
    sourceIdentifier,
  }),
  unsubscribeFromSource: (sourceIdentifier: NewsSourceIdentifier): Actions[typeof SOURCE_UNSUBSCRIBE] => ({
    type: SOURCE_UNSUBSCRIBE,
    sourceIdentifier,
  }),
  startSourceLoad: (sourceIdentifier: NewsSourceIdentifier): Actions[typeof SOURCE_START_LOAD] => ({
    type: SOURCE_START_LOAD,
    sourceIdentifier,
  }),
  stopSourceLoad: (sourceIdentifier: NewsSourceIdentifier, entries: NewsEntry[]): Actions[typeof SOURCE_STOP_LOAD] => ({
    type: SOURCE_STOP_LOAD,
    sourceIdentifier,
    entries,
  }),
  markEntryAsSeen: (identifier: NewsEntryIdentifier): Actions[typeof ENTRY_MARK_SEEN] => ({
    type: ENTRY_MARK_SEEN,
    identifier,
  }),
};
