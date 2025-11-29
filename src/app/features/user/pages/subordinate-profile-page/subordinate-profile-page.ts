import {Component, inject, OnInit, signal} from '@angular/core';
import {Avatar} from '../../../../components/avatar/avatar.component';
import {EvaluatorsList} from '../../components/evaluators-list/evaluators-list.component';
import {Icon} from '../../../../components/icon/icon.component';
import {getFullName, getPositionString} from '../../../utils';
import {IconButton} from '../../../../components/icon-button/icon-button.component';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../api/user.service';
import {take} from 'rxjs';
import {User} from '../../store/user.model';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'subordinate-profile-page',
  imports: [
    Avatar,
    EvaluatorsList,
    Icon,
    IconButton
  ],
  templateUrl: './subordinate-profile-page.html',
  styleUrl: './subordinate-profile-page.css',
})
export class SubordinateProfilePage implements OnInit {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  userService = inject(UserService);
  toastService = inject(ToastrService);

  prevPath = signal("")
  user = signal<User | null>(null)

  private getPrevPathFromUrl(url: string): string {
    const origin = url.split('/')[1];
    switch (origin) {
      case 'my-team':
        return '/my-team';
      case 'employees':
        return '/employees';
      default:
        return '/';
    }
  }

  ngOnInit() {
    this.prevPath.set(this.getPrevPathFromUrl(this.router.url));

    const userId = this.activatedRoute.snapshot.params['id']
    if (!userId) {
      this.router.navigate([this.prevPath()]);
      return;
    }

    this.userService.getUserById({userId}).pipe(
      take(1),
    ).subscribe({
      next: user => {
        this.user.set({
          userId,
          ...user
        })
      },
      error: err => {
        const errorMsg = err.error?.detail ?? "Ошибка получения данных пользователя"
        this.toastService.error(errorMsg)
        this.router.navigate([this.prevPath()])
      }
    })
  }

  onBackButtonClick() {
    this.router.navigate([this.prevPath()]);
  }

  protected readonly getFullName = getFullName;
  protected readonly getPositionString = getPositionString;
}
