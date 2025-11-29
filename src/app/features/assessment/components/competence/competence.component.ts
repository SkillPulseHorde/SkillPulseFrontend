import {Component, input, OnInit, signal} from '@angular/core';
import {Icon} from '../../../../components/icon/icon.component';
import {NgClass} from '@angular/common';
import {Textarea} from '../../../../components/textarea/textarea.component';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'competence',
  imports: [
    Icon,
    NgClass,
    Textarea,
  ],
  templateUrl: './competence.component.html',
  styleUrl: './competence.component.css',
})
export class CompetenceComponent implements OnInit {
  label = input.required()
  openByDefault = input(true)
  control = input.required<FormControl>()

  isOpen = signal(true)

  ngOnInit() {
    this.isOpen.set(this.openByDefault())
  }

  toggleOpen() {
    this.isOpen.set(!this.isOpen())
  }
}
