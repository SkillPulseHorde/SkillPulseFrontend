import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, switchMap, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import {AuthState} from '../store/auth.reducers';
import {logout, refresh} from '../store/auth.actions';
import {CookieService} from 'ngx-cookie-service';

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store<{ auth: AuthState }>);
  const router = inject(Router);
  const authService = inject(AuthService);
  const cookieService = inject(CookieService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        return store.select(state => state.auth.userId).pipe(
          take(1),
          switchMap(userId => {
            if (!userId && !cookieService.get('userId')) {
              authService.logout().subscribe(
                res => {
                  store.dispatch(logout());
                  cookieService.delete('accessToken');
                  cookieService.delete('userId');
                  router.navigate(['/auth/login']);
                }
              )
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
                    expires: new Date(new Date().getTime() + 1000 * 3600 * 6)
                  })
                  const uid = userId ?? cookieService.get('userId');
                  cookieService.set("userId", uid , {
                    path: "/",
                    expires: new Date(new Date().getTime() + 1000 * 3600 * 6)
                  })

                  const clonedReq = req.clone({
                    setHeaders: {
                      Authorization: `Bearer ${response.accessToken}`
                    }
                  });

                  return next(clonedReq);
                } else {
                  authService.logout().subscribe(
                    res => {
                      store.dispatch(logout());
                      cookieService.delete('accessToken');
                      cookieService.delete('userId');
                      router.navigate(['/auth/login']);
                    }
                  )
                  return throwError(() => error);
                }
              }),
              catchError(refreshError => {
                authService.logout().subscribe(
                  res => {
                    store.dispatch(logout());
                    cookieService.delete('accessToken');
                    cookieService.delete('userId');
                    router.navigate(['/auth/login']);
                  }
                )
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
