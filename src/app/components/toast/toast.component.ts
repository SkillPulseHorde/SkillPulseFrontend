import {Component} from '@angular/core';
import {Toast} from 'ngx-toastr';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {Icon} from "../icon/icon.component";
import {NgClass} from "@angular/common";

@Component({
  selector: 'toast',
  imports: [
    Icon,
    NgClass
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  // Toastr is only able to interact with deprecated animations library :(
  animations: [
    trigger('flyInOut', [
      state('inactive', style({
        opacity: 0,
      })),
      transition('inactive => active', animate('400ms ease-out', keyframes([
        style({
          transform: 'translate3d(100%, 0, 0) skewX(-30deg)',
          opacity: 0,
        }),
        style({
          transform: 'skewX(20deg)',
          opacity: 1,
        }),
        style({
          transform: 'skewX(-5deg)',
          opacity: 1,
        }),
        style({
          transform: 'none',
          opacity: 1,
        }),
      ]))),
      transition('active => removed', animate('400ms ease-out', keyframes([
        style({
          opacity: 1,
        }),
        style({
          transform: 'translate3d(100%, 0, 0) skewX(30deg)',
          opacity: 0,
        }),
      ]))),
    ]),
  ],
  preserveWhitespaces: false,
})

export class AppToast extends Toast {
}
