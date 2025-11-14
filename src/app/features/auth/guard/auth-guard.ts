import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {of, switchMap, map, take} from 'rxjs';
import {AuthState} from '../store/auth.reducers';
import {CookieService} from 'ngx-cookie-service';
import {loginSuccess} from '../store/auth.actions';
import {UserService} from '../../user/api/user.service';
import {UserState} from '../../user/store/user.reducers';
import {getUserSuccess} from '../../user/store/user.actions';
import {User} from '../../user/store/user.model';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store<{ auth: AuthState, user: UserState }>);
  const router = inject(Router);
  const cookieService = inject(CookieService);
  const userService = inject(UserService);

  return store.select<string>(state => state.auth.userId).pipe(
    take(1),
    switchMap(uid => {

      if (uid) {
        return store.select(state => state.user.user).pipe(
          take(1),
          switchMap(user => {
            if (user) {
              return of(true)
            }

            return userService.getUserById({userId: uid}).pipe(
              take(1),
              map(res => {
                if (!res?.email) {
                  router.navigate(['/auth/login'])
                  return false
                }

                store.dispatch(getUserSuccess({
                  userId: uid,
                  ...res,
                } as User))
                return true
              })
            )
          })
        )
      }

      const userId = cookieService.get("userId")
      const accessToken = cookieService.get("accessToken")

      if (!userId || !accessToken) {
        router.navigate(['/auth/login']);
        return of(false);
      }

      store.dispatch(loginSuccess({userId, accessToken}))

      return userService.getUserById({userId}).pipe(
        take(1),
        map(res => {
          if (!res?.email) {
            router.navigate(['/auth/login'])
            return false
          }

          store.dispatch(getUserSuccess({
            userId,
            ...res,
          } as User))
          return true
        })
      )
    })
  )
};
