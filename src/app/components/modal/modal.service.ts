import {Injectable, signal, TemplateRef} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ModalService {
  isOpen = signal(false);
  title = signal('Modal');
  content = signal<TemplateRef<any> | null>(null);


  open(title: string, content: TemplateRef<any>) {
    this.title.set(title);
    this.content.set(content);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
