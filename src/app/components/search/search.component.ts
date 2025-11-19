import {Component, input, output} from '@angular/core';
import {Input} from '../input/input.component';
import {FormControl, Validators} from '@angular/forms';
import {Icon} from '../icon/icon.component';

@Component({
  selector: 'app-search',
  imports: [
    Input,
    Icon
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  hint = input<string>();

  query = new FormControl('');

  onQueryChanged = output<string | null>();

  ngOnInit() {
    this.query.valueChanges.subscribe(value => {
      this.onQueryChanged.emit(this.query.value)
    })
  }
}
