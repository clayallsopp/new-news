import NewsEntry, { NewsEntryIdentifier } from "./NewsEntry";
import { NewsSourceIdentifier } from "./NewsSource";

export const SOURCE_SUBSCRIBE = "SOURCE_SUBSCRIBE";
export const SOURCE_UNSUBSCRIBE = "SOURCE_UNSUBSCRIBE";
export const SOURCE_START_LOAD = "SOURCE_START_LOAD";
export const SOURCE_STOP_LOAD = "SOURCE_STOP_LOAD";
export const ENTRY_MARK_SEEN = "ENTRY_MARK_SEEN";

export interface IActions {
  SOURCE_SUBSCRIBE: {
    type: typeof SOURCE_SUBSCRIBE;
    sourceIdentifier: NewsSourceIdentifier;
  };
  SOURCE_UNSUBSCRIBE: {
    type: typeof SOURCE_UNSUBSCRIBE;
    sourceIdentifier: NewsSourceIdentifier;
  };
  SOURCE_START_LOAD: {
    type: typeof SOURCE_START_LOAD;
    sourceIdentifier: NewsSourceIdentifier;
  };
  SOURCE_STOP_LOAD: {
    type: typeof SOURCE_STOP_LOAD;
    sourceIdentifier: NewsSourceIdentifier;
    entries: NewsEntry[];
  };
  ENTRY_MARK_SEEN: {
    type: typeof ENTRY_MARK_SEEN;
    identifier: NewsEntryIdentifier;
  };
}

export const actionCreators = {
  markEntryAsSeen: (
    identifier: NewsEntryIdentifier
  ): IActions[typeof ENTRY_MARK_SEEN] => ({
    identifier,
    type: ENTRY_MARK_SEEN
  }),
  startSourceLoad: (
    sourceIdentifier: NewsSourceIdentifier
  ): IActions[typeof SOURCE_START_LOAD] => ({
    sourceIdentifier,
    type: SOURCE_START_LOAD
  }),
  stopSourceLoad: (
    sourceIdentifier: NewsSourceIdentifier,
    entries: NewsEntry[]
  ): IActions[typeof SOURCE_STOP_LOAD] => ({
    entries,
    sourceIdentifier,
    type: SOURCE_STOP_LOAD
  }),
  subscribeToSource: (
    sourceIdentifier: NewsSourceIdentifier
  ): IActions[typeof SOURCE_SUBSCRIBE] => ({
    sourceIdentifier,
    type: SOURCE_SUBSCRIBE
  }),
  unsubscribeFromSource: (
    sourceIdentifier: NewsSourceIdentifier
  ): IActions[typeof SOURCE_UNSUBSCRIBE] => ({
    sourceIdentifier,
    type: SOURCE_UNSUBSCRIBE
  })
};
