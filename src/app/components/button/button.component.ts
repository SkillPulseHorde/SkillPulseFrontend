import {Component, input} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: 'button.component.html',
  styleUrl: 'button.component.css'
})

export class Button {
  label = input("")
}
