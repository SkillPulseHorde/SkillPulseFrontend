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

  prevPath = signal("")
  user = signal<User | null>(null)

  ngOnInit() {
    const origin = this.router.url.split('/')[1]

    switch (origin) {
      case 'my-team': {
        this.prevPath.set("/my-team")
        break
      }
      case 'employees': {
        this.prevPath.set("/employees")
        break
      }
    }

    const userId = this.activatedRoute.snapshot.params['id']

    this.userService.getUserById({userId}).pipe(
      take(1),
    ).subscribe({
      next: user => {
        this.user.set({
          userId,
          ...user
        })
      }
    })
  }

  onBackButtonClick() {
    this.router.navigate([this.prevPath()]);
  }

  protected readonly getFullName = getFullName;
  protected readonly getPositionString = getPositionString;
}
