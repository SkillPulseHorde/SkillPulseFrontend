import {Component, input} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {Icon} from '../../icon/icon.component';

@Component({
  selector: 'menu-item',
  imports: [
    ReactiveFormsModule,
    Icon,
  ],
  templateUrl: './menu-item.component.html',
  standalone: true,
  styleUrl: './menu-item.component.css'
})
export class MenuItem{
  iconSize = input.required<number>();
  srcIcon = input.required<string>();
  title = input.required<string>();
  notification = input<number | null>(null);
}
