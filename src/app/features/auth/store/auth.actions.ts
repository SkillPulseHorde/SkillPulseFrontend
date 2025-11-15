import { createAction, props } from '@ngrx/store';
import {LoginResponse, RefreshResponse} from './auth.model';

export const register = createAction(
  '[Auth] Register',
)

export const registerSuccess = createAction(
  '[Auth] Register Success',
)

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
)

export const login = createAction(
  '[Auth] Login',
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<LoginResponse>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const refresh = createAction(
  '[Auth] Refresh',
  props<RefreshResponse>()
);
