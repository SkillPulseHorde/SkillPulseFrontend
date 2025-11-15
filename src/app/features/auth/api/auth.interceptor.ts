import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {AuthState} from '../store/auth.reducers';
import {exhaustMap, take} from 'rxjs/operators';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const store = inject(Store<{auth: AuthState}>);
  return store.select(state => state.auth.accessToken).pipe(
    take(1),
    exhaustMap(token => {
      if (token) {
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(cloned);
      } else {
        return next(req);
      }
    })
  );
}
