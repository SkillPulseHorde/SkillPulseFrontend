import {Component, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';
import {User} from '../../features/user/store/user.model';
import {Observable, take} from 'rxjs';
import {Store} from '@ngrx/store';
import {UserState} from '../../features/user/store/user.reducers';
import {SideMenu} from '../../components/side-menu/side-menu.component';
import {Icon} from '../../components/icon/icon.component';
import {getFullName, getMenuItemsByPosition, getPositionString} from '../../features/utils';
import {logout} from '../../features/auth/store/auth.actions';
import {AuthService} from '../../features/auth/api/auth.service';

@Component({
  selector: 'main-layout',
  templateUrl: 'main-layout.component.html',
  imports: [
    RouterOutlet,
    AsyncPipe,
    SideMenu,
    NgOptimizedImage,
    Icon
  ],
  styleUrl: 'main-layout.component.css'
})

export class MainLayout {
  private router = inject(Router);
  private authService = inject(AuthService);

  user$: Observable<User | null>;
  loading$: Observable<boolean>;

  constructor(private store: Store<{ user: UserState }>) {
    this.user$ = store.select(state => state.user.user)
    this.loading$ = store.select(state => state.user.loading)
  }

  protected readonly getPositionString = getPositionString;
  protected readonly getFullName = getFullName;

  logout(){
    this.authService.logout().pipe(
      take(1),
    ).subscribe(
      () => {
        this.store.dispatch(logout())
        this.router.navigate(['/auth/login']);
      }
    )
  }

  protected readonly getMenuItemsByPosition = getMenuItemsByPosition;
}
