import {Component} from '@angular/core';
import {Button} from '../../../../components/button/button.component';
import {Input} from '../../../../components/input/input.component';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthState} from '../../store/auth.reducers';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AuthService} from '../../api/auth.service';
import {login, loginFailure, loginSuccess} from '../../store/auth.actions';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'login-page',
  templateUrl: 'login-page.component.html',
  imports: [
    Button,
    Input,
    AsyncPipe,
    ReactiveFormsModule
  ],
  standalone: true,
  styleUrl: 'login-page.component.css'
})

export class LoginPage {
  authService: AuthService;
  loading$: Observable<boolean>

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor(private store: Store<{ auth: AuthState }>) {
    this.loading$ = store.select<boolean>((state) => state.auth.loading);
    this.authService = new AuthService();

    this.loading$.subscribe(loading => {
      console.log("Загрузка ", loading);
    })
  }

  protected onSubmit = (): void => {
    this.store.dispatch(login())
    this.authService.login({
      email: this.email.value!,
      password: this.password.value!
    }).subscribe({
      next: res => {
        this.store.dispatch(loginSuccess(res))
      },
      error: err => {
        this.store.dispatch(loginFailure({error: "Ошибка"}));
      }
    })
  }
}
