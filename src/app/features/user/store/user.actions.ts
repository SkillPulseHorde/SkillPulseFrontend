import {createAction, props} from '@ngrx/store';
import {User} from './user.model';


export const getUser = createAction(
  '[User] Get User'
)

export const getUserSuccess = createAction(
  '[User] Get User Success',
  props<User>()
)

export const getUserFailure = createAction(
  '[User] Get User Failure',
  props<{ error: string }>()
)
