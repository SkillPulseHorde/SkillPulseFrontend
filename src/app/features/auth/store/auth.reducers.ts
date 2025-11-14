import {createReducer, on} from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  userId: string | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  userId: null,
  accessToken: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.registerSuccess, (state) => ({
    ...state,
    loading: false,
  })),

  on(AuthActions.registerFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, {userId, accessToken}) => ({
    ...state,
    userId,
    accessToken,
    loading: false,
  })),

  on(AuthActions.loginFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),

  on(AuthActions.logout, () => initialState),

  on(AuthActions.refresh, (state, {accessToken}) => ({
    ...state,
    accessToken,
  }))
);
