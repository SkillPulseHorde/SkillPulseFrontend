import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {logout} from './auth.actions';
import {map, tap} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {clearUser} from '../../user/store/user.actions';

@Injectable()
export class AuthEffects {

  private actions$ = inject(Actions)
  private cookieService = inject(CookieService)

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          this.cookieService.delete("accessToken", "/")
          this.cookieService.delete("userId", "/")
        }),
        map(() => clearUser())
      )
  )
}
