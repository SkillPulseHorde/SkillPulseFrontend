import {Component, input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

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
  control = input.required<FormControl>()
}
