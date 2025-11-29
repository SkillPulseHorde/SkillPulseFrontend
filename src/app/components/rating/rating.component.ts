import {Component, input, signal} from '@angular/core';
import {Icon} from '../icon/icon.component';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'rating',
  imports: [
    Icon
  ],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
})
export class Rating {
  max = input(5)
  control = input.required<FormControl>()

  hoverRating = signal(0)

  ratingChanged(rating: number) {
    this.control().setValue(rating);
  }

  mouseEnter(rating: number) {
    this.hoverRating.set(rating);
  }

  mouseLeave() {
    this.hoverRating.set(this.control().value);
  }

  protected readonly Array = Array;
}
