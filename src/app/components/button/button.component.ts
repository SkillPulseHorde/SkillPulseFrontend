import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: 'button.component.html',
  standalone: true,
  styleUrl: 'button.component.css'
})

export class Button {
  type = input("button")
  label = input("")
  width = input("min-content")
  disabled = input(false)

  buttonClick = output<void>();

  protected onClick = (): void => {
    this.buttonClick.emit()
  }
}
