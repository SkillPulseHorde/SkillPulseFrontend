import {Component, computed, input, output, signal} from '@angular/core';
import {Icon} from '../icon/icon.component';

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

  rating = signal(0)
  hoverRating = signal(0)

  ratingChanged(rating: number) {
    this.rating.set(rating);
  }

  mouseEnter(rating: number) {
    this.hoverRating.set(rating);
  }

  mouseLeave() {
    this.hoverRating.set(this.rating());
  }

  protected readonly Array = Array;
}
