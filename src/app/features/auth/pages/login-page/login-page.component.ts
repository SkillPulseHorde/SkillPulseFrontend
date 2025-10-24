import {Component, ComponentRef, viewChild} from '@angular/core';
import {Button} from '../../../../components/button/button.component';
import {Input} from '../../../../components/input/input.component';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'login-page',
  templateUrl: 'login-page.component.html',
  imports: [
    Button,
    Input,
    ReactiveFormsModule
  ],
  styleUrl: 'login-page.component.css'
})

export class LoginPage {
  email = new FormControl('')
  password =  new FormControl('')

  protected onSubmit = (): void => {
    console.log(this.email.value, this.password.value);
  }
}
