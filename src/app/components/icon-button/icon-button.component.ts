import {Component, input, output} from '@angular/core';
import {Icon} from '../icon/icon.component';

@Component({
  selector: 'icon-button',
  imports: [
    Icon
  ],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.css',
})
export class IconButton {
  icon = input.required<string>()
  size = input(18)

  buttonClick = output<void>();

  protected onClick = (): void => {
    this.buttonClick.emit()
  }
}
