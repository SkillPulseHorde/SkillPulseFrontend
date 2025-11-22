import {Component, ElementRef, HostListener, inject, input, signal} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {SidebarItem} from './sidebar-item/sidebar-item.component';
import {MenuItem} from './menu-item/menu-item.component';
import {Icon} from '../icon/icon.component';
import {MenuItemProps} from '../../layout/main-layout/main-layout.model';
import {Router} from '@angular/router';

@Component({
  selector: 'side-menu',
  imports: [
    ReactiveFormsModule,
    SidebarItem,
    MenuItem,
    Icon,
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenu {
  router = inject(Router);

  isOpen = signal(false);
  menuItems = input.required<MenuItemProps[]>()

  setIsOpened(isOpen: boolean) {
    this.isOpen.set(isOpen);
  }

  onItemClicked(path: string) {
    this.router.navigate([path]);
    this.isOpen.set(false);
  }

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
