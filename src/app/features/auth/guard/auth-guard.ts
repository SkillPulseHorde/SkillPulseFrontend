import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {map, take} from 'rxjs';
import {UserState} from '../../user/store/user.reducers';
import {AuthState} from '../store/auth.reducers';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store<{auth: AuthState}>);
  const router = inject(Router);

  return store.select<string>(state => state.auth.userId).pipe(
    take(1),
    map(userId => {
      if (userId) {
        return true;
      } else {
        router.navigate(['/auth/login'])
        return false
      }
    })
  );
};
