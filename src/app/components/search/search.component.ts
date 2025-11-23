import {Component, input, output} from '@angular/core';
import {Input} from '../input/input.component';
import {FormControl} from '@angular/forms';
import {Icon} from '../icon/icon.component';
import {debounceTime, Subscription} from 'rxjs';

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

  queryChangedSubscription!: Subscription;

  onQueryChanged = output<string | null>();

  ngOnInit() {
    this.queryChangedSubscription = this.query.valueChanges.pipe(
      debounceTime(250),
    ).subscribe(value => {
      this.onQueryChanged.emit(value)
    })
  }

  ngOnDestroy() {
    if (!this.queryChangedSubscription) return

    this.queryChangedSubscription.unsubscribe();
  }
}
