import {Component, input} from '@angular/core';

@Component({
  selector: 'app-fieldset',
  imports: [],
  templateUrl: './fieldset.component.html',
  styleUrl: './fieldset.component.css'
})
export class Fieldset {
  title = input.required();
}
