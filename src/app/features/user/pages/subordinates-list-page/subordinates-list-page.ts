import {Component, inject, OnInit, signal} from '@angular/core';
import {Router} from '@angular/router';
import {UserState} from '../../store/user.reducers';
import {Store} from '@ngrx/store';
import {UserService} from '../../api/user.service';
import {take} from 'rxjs';
import {Evaluator, Subordinate} from '../../store/user.model';
import {ToastrService} from 'ngx-toastr';
import {Fieldset} from '../../../../components/fieldset/fieldset.component';
import {SubordinatesListItem} from '../../components/subordinates-list-item/subordinates-list-item.component';

@Component({
  selector: 'subordinates-list-page',
  imports: [
    Fieldset,
    SubordinatesListItem,
  ],
  templateUrl: './subordinates-list-page.html',
  styleUrl: './subordinates-list-page.css',
})
export class SubordinatesListPage implements OnInit {
  router = inject(Router);
  store = inject(Store<{user: UserState}>);
  userService = inject(UserService);
  toastService = inject(ToastrService);

  title = signal("")
  subordinates = signal<Subordinate[] | Evaluator[]>([])
  filteredSubordinates = signal<Subordinate[] | Evaluator[]>([])

  ngOnInit() {
    const currentUrl = this.router.url;

    switch(currentUrl) {
      case '/my-team': {
        this.title.set("Моя команда")
        this.store.select(state => state.user?.user?.userId).pipe(
          take(1),
        ).subscribe(
          userId => {
            this.fetchSubordinates(userId);
          }
        )
        break;
      }
      case '/employees': {
        this.title.set("Сотрудники")
        this.store.select(state => state.user?.user?.userId).pipe(
          take(1),
        ).subscribe(
          userId => {
            this.fetchAllEmployees(userId);
          }
        )
        break;
      }
    }
  }

  private fetchSubordinates(userId: string) {
    this.userService.getSubordinates({userId}).pipe(
      take(1),
    ).subscribe({
      next: subordinates => {
        this.subordinates.set(subordinates);
        this.filteredSubordinates.set(subordinates);
      },
      error: err => {
        const errorMsg = err.error?.detail ?? "Ошибка получения списка подчиненных"
        this.toastService.error(errorMsg);
      }
    })
  }

  private fetchAllEmployees(userId: string) {
    this.userService.getUsers({userId, includeCurrentUser: false}).pipe(
      take(1),
    ).subscribe({
      next: subordinates => {
        this.subordinates.set(subordinates);
        this.filteredSubordinates.set(subordinates);
      },
      error: err => {
        const errorMsg = err.error?.detail ?? "Ошибка получения списка подчиненных"
        this.toastService.error(errorMsg);
      }
    })
  }
}
