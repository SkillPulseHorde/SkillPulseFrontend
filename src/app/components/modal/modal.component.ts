import { Component } from '@angular/core';
import {ModalService} from './modal.service';
import {Icon} from '../icon/icon.component';
import {NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'modal',
  imports: [
    Icon,
    NgTemplateOutlet
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class Modal {
  constructor(public modal: ModalService) {}
}
