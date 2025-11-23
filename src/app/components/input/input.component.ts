import {Component, input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {InputVariant} from './input.model';

@Component({
  selector: 'app-input',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './input.component.html',
  standalone: true,
  styleUrl: './input.component.css'
})
export class Input{
  type = input("text")
  placeholder = input("")
  control = input.required<FormControl>()
  variant = input<InputVariant>("default")
  disabled = input<boolean>(false)
}
