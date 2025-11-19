import {Component, input} from '@angular/core';

@Component({
  selector: 'icon',
  templateUrl: 'icon.component.html',
  standalone: true,
  styleUrl: 'icon.component.css'
})

export class Icon {
  size = input.required<number>();
  type = input.required<string>()
}
