import {Component, input} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {Icon} from '../../icon/icon.component';

@Component({
  selector: 'sidebar-item',
  imports: [
    ReactiveFormsModule,
    Icon,
  ],
  templateUrl: './sidebar-item.component.html',
  standalone: true,
  styleUrl: './sidebar-item.component.css'
})
export class SidebarItem{
  srcIcon = input.required<string>();
  notification = input<number | null>(null);
}
