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
import {getUser} from '../../../user/store/user.actions';
import {CookieService} from 'ngx-cookie-service';

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
  private cookieService = inject(CookieService);
  private authService = inject(AuthService);

  loading$: Observable<boolean>

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor(private store: Store<{ auth: AuthState }>) {
    this.loading$ = store.select<boolean>((state) => state.auth.loading);
  }

  protected onSubmit = (): void => {
    this.store.dispatch(login())
    this.cookieService.delete('accessToken')
    this.cookieService.delete('userId')
    this.authService.login({
      email: this.email.value!,
      password: this.password.value!
    }).subscribe({
      next: res => {
        this.store.dispatch(loginSuccess(res))
        this.store.dispatch(getUser())
        this.cookieService.set("accessToken", res.accessToken, {
          path: "/",
          expires: new Date(new Date().getTime() + 1000 * 3600 * 6)
        })
        this.cookieService.set("userId", res.userId, {
          path: "/",
          expires: new Date(new Date().getTime() + 1000 * 3600 * 6)
        })
        this.router.navigate(['/app'])
      },
      error: err => {
        console.error(err)
        this.store.dispatch(loginFailure({error: "Ошибка авторизации"}));
      }
    })
  }
}
