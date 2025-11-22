import {Component, computed, ElementRef, HostListener, input, output, signal} from '@angular/core';
import {SelectOption} from './select.model';
import {Icon} from '../icon/icon.component';
import {SearchComponent} from '../search/search.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-select',
  imports: [
    Icon,
    SearchComponent,
    NgClass
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})
export class SelectComponent {
  placeholder = input("")
  options = input.required<SelectOption[]>();
  selected = input.required<SelectOption | undefined>();

  selectedLabel = computed<string | undefined>(() => this.selected()?.label);
  isOpen = signal<boolean>(false)
  optionSelected = output<string>()
  queryChanged = output<string | null>()

  constructor(private el: ElementRef) {}

  toggleSelect() {
    this.isOpen.set(!this.isOpen())
  }

  onQueryChange(query: string | null) {
    this.queryChanged.emit(query);
  }

  selectOption(value: string) {
    this.optionSelected.emit(value);
    this.queryChanged.emit("");
    this.isOpen.set(false);
  }
}
