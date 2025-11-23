import {Component, input, output} from '@angular/core';
import {ButtonVariant} from './button.model';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-button',
  templateUrl: 'button.component.html',
  standalone: true,
  imports: [
    NgClass
  ],
  styleUrl: 'button.component.css'
})

export class Button {
  type = input("button")
  label = input.required()
  width = input("min-content")
  disabled = input(false)
  variant = input<ButtonVariant>("primary")

  buttonClick = output<void>();

  protected onClick = (): void => {
    this.buttonClick.emit()
  }
}
