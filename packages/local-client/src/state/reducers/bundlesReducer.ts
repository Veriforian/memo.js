import produce from 'immer';

import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface BundlesState {
  [key: string]:
    | {
        loading: boolean;
        code: string;
        err: string;
      }
    | undefined;
}

const initialState = {};

const reducer = produce(
  (state: BundlesState = initialState, action: Action): BundlesState => {
    switch (action.type) {
      case ActionType.BUNDLE_START:
        //Throw away any exsisting bundle, and set loading to true
        state[action.payload.cellId] = {
          loading: true,
          code: '',
          err: ''
        };

        return state;
      case ActionType.BUNDLE_COMPLETE:
        //Set result of bundle to state
        state[action.payload.cellId] = {
          loading: false,
          code: action.payload.bundle.code,
          err: action.payload.bundle.err
        };

        return state;
      default:
        return state;
    }
  }
);

export default reducer;
