import {Component, computed, effect, inject, signal} from '@angular/core';
import {Button} from "../../../../components/button/button.component";
import {Input} from "../../../../components/input/input.component";
import {FormControl, Validators} from '@angular/forms';
import {login, loginSuccess, register, registerFailure, registerSuccess} from '../../store/auth.actions';
import {Store} from '@ngrx/store';
import {AuthState} from '../../store/auth.reducers';
import {AuthService} from '../../api/auth.service';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'register-page',
  templateUrl: 'register-page.component.html',
  imports: [
    Button,
    Input,
    AsyncPipe,
    RouterLink
  ],
  standalone: true,
  styleUrl: 'register-page.component.css'
})

export class RegisterPage {
  private router = inject(Router);

  authService: AuthService;
  loading$: Observable<boolean>

  email = new FormControl("", [Validators.required, Validators.email]);
  password = new FormControl("", [Validators.required, Validators.minLength(8), Validators.pattern("^(?!.*\\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).+$")]);
  passwordConfirm = new FormControl("", [Validators.required, Validators.minLength(8), Validators.pattern("^(?!.*\\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).+$")]);

  constructor(private store: Store<{ auth: AuthState }>) {
    this.loading$ = store.select<boolean>((state) => state.auth.loading);
    this.authService = new AuthService();

    this.passwordConfirm.valueChanges.subscribe(value => {
      if (value === this.password.value) {
        this.passwordConfirm.setErrors(null)
      } else {
        this.passwordConfirm.setErrors({'passwordsunmatches': true})
      }
    })
  }

  protected onSubmit = (): void => {
    this.store.dispatch(register())
    this.authService.register({
      email: this.email.value!,
      password: this.password.value!
    }).subscribe({
      next: () => {
        this.store.dispatch(registerSuccess())
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.store.dispatch(registerFailure({error: "Ошибка"}))
      }
    })
  }
}
