import {Component, } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {Avatar} from '../../../../components/avatar/avatar.component';
import {Icon} from '../../../../components/icon/icon.component';
import {Observable} from 'rxjs';
import {User} from '../../store/user.model';
import {Store} from '@ngrx/store';
import {UserState} from '../../store/user.reducers';
import {AsyncPipe} from '@angular/common';
import {getFullName, getPositionString} from '../../utils';

@Component({
  selector: 'profile-page',
  templateUrl: 'profile-page.component.html',
  imports: [
    ReactiveFormsModule,
    Avatar,
    Icon,
    AsyncPipe
  ],
  standalone: true,
  styleUrl: 'profile-page.component.css'
})

export class ProfilePage {

  user$: Observable<User | null>

  constructor(private store: Store<{ user: UserState }>) {
    this.user$ = store.select<User | null>((state) => state.user.user);
  }

  protected readonly getFullName = getFullName;
  protected readonly getPositionString = getPositionString;
}
