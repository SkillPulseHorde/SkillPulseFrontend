import {Component} from '@angular/core';
import {Button} from "../../../../components/button/button.component";
import {Input} from "../../../../components/input/input.component";
import {FormControl} from '@angular/forms';

@Component({
  selector: 'register-page',
  templateUrl: 'register-page.component.html',
  imports: [
    Button,
    Input
  ],
  styleUrl: 'register-page.component.css'
})

export class RegisterPage {
  email = new FormControl("")
  password = new FormControl("")
  passwordConfirm = new FormControl("")

  protected onSubmit = (): void => {
    console.log(this.email.value, this.password.value);
  }
}
