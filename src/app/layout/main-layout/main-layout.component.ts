import {Component, inject, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';
import {User} from '../../features/user/store/user.model';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {UserState} from '../../features/user/store/user.reducers';
import {SideMenu} from '../../components/side-menu/side-menu.component';
import {Icon} from '../../components/icon/icon.component';
import {getFullName, getMenuItemsByPosition, getPositionString} from '../../features/user/utils';
import {MenuItemProps} from './main-layout.model';
import {logout} from '../../features/auth/store/auth.actions';

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

  user$: Observable<User | null>;
  menuItems = signal<MenuItemProps[]>([])

  constructor(private store: Store<{ user: UserState }>) {
    this.user$ = store.select(state => state.user.user)

    this.user$.subscribe(user => {
      this.menuItems.set(getMenuItemsByPosition(user?.position))
    })
  }

  protected readonly getPositionString = getPositionString;
  protected readonly getFullName = getFullName;

  logout(){
    this.store.dispatch(logout())
    this.router.navigate(['/auth/login']);
  }
}
