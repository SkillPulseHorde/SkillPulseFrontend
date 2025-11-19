import {Component, input, signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {Icon} from '../icon/icon.component';

@Component({
  selector: 'checkbox',
  imports: [
    NgClass,
    Icon
  ],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css'
})
export class Checkbox {
  padding = input<number>(0);
  checked = input(false);


}
