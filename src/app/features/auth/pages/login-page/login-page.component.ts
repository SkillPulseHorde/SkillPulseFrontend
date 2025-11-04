import {Component, inject} from '@angular/core';
import {Button} from '../../../../components/button/button.component';
import {Input} from '../../../../components/input/input.component';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthState} from '../../store/auth.reducers';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AuthService} from '../../api/auth.service';
import {login, loginFailure, loginSuccess} from '../../store/auth.actions';
import {AsyncPipe} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {UserService} from '../../../user/api/user.service';
import {getUser, getUserFailure, getUserSuccess} from '../../../user/store/user.actions';
import {User} from '../../../user/store/user.model';

@Component({
  selector: 'login-page',
  templateUrl: 'login-page.component.html',
  imports: [
    Button,
    Input,
    AsyncPipe,
    ReactiveFormsModule,
    RouterLink
  ],
  standalone: true,
  styleUrl: 'login-page.component.css'
})

export class LoginPage {
  private router = inject(Router);

  authService: AuthService;
  userService: UserService
  loading$: Observable<boolean>

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor(private store: Store<{ auth: AuthState }>) {
    this.loading$ = store.select<boolean>((state) => state.auth.loading);
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  protected onSubmit = (): void => {
    this.store.dispatch(login())
    this.authService.login({
      email: this.email.value!,
      password: this.password.value!
    }).subscribe({
      next: res => {
        this.store.dispatch(loginSuccess(res))
        this.store.dispatch(getUser())
        const userId = res.userId
        this.userService.getUserById({userId}).subscribe({
          next: res => {
            this.store.dispatch(getUserSuccess({
              userId: userId,
              ...res,
            } as User))
            this.router.navigate(['/app'])
          },
          error: err => {
            console.error(err)
            this.store.dispatch(getUserFailure({error: "Ошибка получения данных пользователя"}))
          }
        })
      },
      error: err => {
        console.error(err)
        this.store.dispatch(loginFailure({error: "Ошибка авторизации"}));
      }
    })
  }
}
