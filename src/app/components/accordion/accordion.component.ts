import {Component, contentChild, signal, TemplateRef} from '@angular/core';
import {Icon} from '../icon/icon.component';
import {NgClass, NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'accordion',
  imports: [
    Icon,
    NgTemplateOutlet,
    NgClass
  ],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css',
})
export class Accordion {
  accordionTitle = contentChild<TemplateRef<any>>('accordionTitle');
  accordionContent = contentChild<TemplateRef<any>>('accordionContent');

  isOpen = signal(false)

  toggleOpen() {
    this.isOpen.set(!this.isOpen())
  }
}
