import {createReducer, on} from '@ngrx/store';
import * as UserActions from './user.actions';
import {User} from './user.model';

export interface UserState {
  user: User | null,
  loading: boolean,
  error: string | null
}

export const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,

  on(UserActions.getUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.getUserSuccess, (state, user) => ({
    ...state,
    user,
    loading: false,
  })),

  on(UserActions.getUserFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(UserActions.clearUser, () => initialState),
);
