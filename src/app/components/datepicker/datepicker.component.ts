import {Component, input} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';

@Component({
  selector: 'datepicker',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.css',
})
export class Datepicker {
  placeholder = input("")
  control = input.required<FormControl<string | null>>()
  minDate = input<Date | null>(null)
  disabled = input<boolean>(false)
}
