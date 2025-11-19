import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, switchMap, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import {AuthState} from '../store/auth.reducers';
import {logout, refresh} from '../store/auth.actions';
import {CookieService} from 'ngx-cookie-service';
import {getExpirationTime} from '../../utils';

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store<{ auth: AuthState }>);
  const router = inject(Router);
  const authService = inject(AuthService);
  const cookieService = inject(CookieService);

  const logoutUser = () => {
    authService.logout().pipe(
      take(1),
    ).subscribe(
      () => {
        store.dispatch(logout());
        router.navigate(['/auth/login']);
      }
    )
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh') && !req.url.includes('/auth/login')) {
        return store.select(state => state.auth.userId).pipe(
          take(1),
          switchMap(userId => {
            if (!userId && !cookieService.get('userId')) {
              logoutUser()
              return throwError(() => error);
            }

            return authService.refresh().pipe(
              switchMap(response => {
                if (response?.accessToken) {
                  store.dispatch(refresh({
                    accessToken: response.accessToken
                  }));
                  cookieService.set("accessToken", response.accessToken, {
                    path: "/",
                    expires: getExpirationTime(),
                    sameSite: 'Strict'
                  })
                  const uid = userId ?? cookieService.get('userId');
                  cookieService.set("userId", uid, {
                    path: "/",
                    expires: getExpirationTime(),
                    sameSite: 'Strict'
                  })

                  const clonedReq = req.clone({
                    setHeaders: {
                      Authorization: `Bearer ${response.accessToken}`
                    }
                  });

                  return next(clonedReq);
                } else {
                  logoutUser()
                  return throwError(() => error);
                }
              }),
              catchError(refreshError => {
                logoutUser()
                return throwError(() => refreshError);
              })
            );
          })
        );
      }

      return throwError(() => error);
    })
  );
};
