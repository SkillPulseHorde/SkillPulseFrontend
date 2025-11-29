import {Component, input} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-textarea',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.css',
})
export class Textarea {
  placeholder = input("")
  control = input.required<FormControl>()
}
