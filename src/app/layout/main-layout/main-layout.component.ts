import {Component, inject, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';
import {User} from '../../features/user/store/user.model';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {UserState} from '../../features/user/store/user.reducers';
import {SideMenu} from '../../components/side-menu/side-menu.component';
import {Icon} from '../../components/icon/icon.component';
import {getLastNameWithInitials, getMenuItemsByPosition, getPositionString} from '../../features/user/utils';
import {MenuItemProps} from './main-layout.model';
import {logout} from '../../features/auth/store/auth.actions';
import {CookieService} from 'ngx-cookie-service';
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
  private cookieService = inject(CookieService);
  private authService = inject(AuthService);

  user$: Observable<User | null>;
  menuItems = signal<MenuItemProps[]>([])

  constructor(private store: Store<{ user: UserState }>) {
    this.user$ = store.select(state => state.user.user)

    this.user$.subscribe(user => {
      this.menuItems.set(getMenuItemsByPosition(user?.position))
    })
  }

  protected readonly getPositionString = getPositionString;
  protected readonly getLastNameWithInitials = getLastNameWithInitials;

  logout(){
    this.authService.logout().subscribe(
      res => {
        this.store.dispatch(logout())
        this.cookieService.delete("userId")
        this.cookieService.delete("accessToken")
        this.router.navigate(['/auth/login']);
      }
    )
  }
}
