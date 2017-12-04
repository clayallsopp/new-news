export const SUBSCRIBE_SOURCE = 'SUBSCRIBE_SOURCE';

export type Actions = {
  SUBSCRIBE_SOURCE: {
    type: typeof SUBSCRIBE_SOURCE,
  },
};

export const actionCreators = {
  subscribeToSource: (): Actions[typeof SUBSCRIBE_SOURCE] => ({
    type: SUBSCRIBE_SOURCE,
  }),
};
