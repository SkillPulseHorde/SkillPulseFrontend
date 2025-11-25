import {RouterModule, Routes} from '@angular/router';
import {AuthLayout} from './layout/auth-layout/auth-layout.component';
import {LoginPage} from './features/auth/pages/login-page/login-page.component';
import {RegisterPage} from './features/auth/pages/register-page/register-page.component';
import {NgModule} from '@angular/core';
import {authGuard} from './features/auth/guard/auth-guard';
import {MainLayout} from './layout/main-layout/main-layout.component';
import {ProfilePage} from './features/user/pages/profile-page/profile-page.component';
import {ManageAssessmentsPage} from './features/assessment/pages/manage-assessments-page/manage-assessments-page';
import {NewAssessmentPage} from './features/assessment/pages/new-assessment-page/new-assessment-page';
import {AssessmentsListPage} from './features/assessment/pages/assessments-list-page/assessments-list-page';
import {AssessmentFormPage} from './features/assessment/pages/assessment-form-page/assessment-form-page';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: LoginPage,
      },
      {
        path: 'register',
        component: RegisterPage,
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      }
    ],
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        component: ProfilePage
      },
      {
        path: 'assessments',
        component: AssessmentsListPage,
      },
      {
        path: 'assessments/:assessmentId',
        component: AssessmentFormPage
      },
      // TODO: Нужно сделать guard для проверки доступа
      {
        path: 'manage-assessments',
        component: ManageAssessmentsPage,
      },
      {
        path: 'manage-assessments/new',
        component: NewAssessmentPage
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/profile',
  }
];
