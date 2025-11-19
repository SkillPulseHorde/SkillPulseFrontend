import {Component, input} from '@angular/core';
import {Icon} from '../icon/icon.component';

@Component({
  selector: 'avatar',
  templateUrl: 'avatar.component.html',
  standalone: true,
  imports: [
    Icon
  ],
  styleUrl: 'avatar.component.css'
})

export class Avatar {
  size = input(32)
}
