import {Component, ElementRef, HostListener, inject, input, OnDestroy, signal} from '@angular/core';
import {Evaluator, Subordinate} from '../../store/user.model';
import { getFullName, getPositionString } from '../../../utils';
import {Avatar} from '../../../../components/avatar/avatar.component';
import {Icon} from '../../../../components/icon/icon.component';
import {Router} from '@angular/router';

@Component({
  selector: 'subordinates-list-item',
  imports: [
    Avatar,
    Icon
  ],
  templateUrl: './subordinates-list-item.component.html',
  styleUrl: './subordinates-list-item.component.css',
})
export class SubordinatesListItem implements OnDestroy {
  router = inject(Router)

  subordinate = input.required<Subordinate | Evaluator>();

  isMenuOpen = signal(false);
  menuPosition = signal({ x: '0px', y: '0px' });

  constructor(private elementRef: ElementRef) {}

  openMenu(event: MouseEvent) {
    event.preventDefault();

    document.dispatchEvent(new CustomEvent('closeAllMenus', { detail: this.elementRef.nativeElement }));

    const cardRect = (event.currentTarget as HTMLElement).getBoundingClientRect();

    const relativeX = event.clientX - cardRect.left;
    const relativeY = event.clientY - cardRect.top;

    this.menuPosition.set({
      x: `${relativeX}px`,
      y: `${relativeY}px`
    });

    this.isMenuOpen.set(true);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  onProfileButtonClick() {
    this.router.navigate([this.router.url, this.subordinate().id])
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.closeMenu();
    }
  }

  @HostListener('document:closeAllMenus', ['$event'])
  onCloseAllMenus(event: Event) {
    const customEvent = event as CustomEvent;

    if (customEvent.detail !== this.elementRef.nativeElement) {
      this.closeMenu();
    }
  }

  ngOnDestroy() {
    this.closeMenu();
  }

  protected readonly getFullName = getFullName;
  protected readonly getPositionString = getPositionString;
}
