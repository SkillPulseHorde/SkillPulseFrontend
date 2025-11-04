import {Component, input, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NgOptimizedImage} from '@angular/common';
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
