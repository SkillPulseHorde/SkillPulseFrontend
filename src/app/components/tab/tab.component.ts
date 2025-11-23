import {Component, input, output} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'tab',
  imports: [
    NgClass
  ],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css',
})
export class Tab {
  id = input.required<number>()
  title = input.required<string>()
  isActive = input.required<boolean>()
  onClick = output<number>()

  tabClicked(id: number) {
    this.onClick.emit(id)
  }
}
