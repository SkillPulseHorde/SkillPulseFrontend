import {BrowserModule} from '@angular/platform-browser';
import {NgModule, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';

import {AppComponent} from './app.component';

import {StoreModule} from '@ngrx/store';
import {authReducer} from './features/auth/store/auth.reducers';
import {provideRouter, RouterOutlet} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {routes} from "./app.routes";
import {userReducer} from './features/user/store/user.reducers';
import {authInterceptor} from './features/auth/api/auth.interceptor';
import {refreshInterceptor} from './features/auth/api/refresh.interceptor';
import {EffectsModule} from '@ngrx/effects';
import {AuthEffects} from './features/auth/store/auth.effects';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppToast} from './components/toast/toast.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterOutlet,
    EffectsModule.forRoot([AuthEffects]),
    StoreModule.forRoot({auth: authReducer, user: userReducer}),
    ToastrModule.forRoot({
      toastClass: 'appToast',
      toastComponent: AppToast,
      maxOpened: 5,
      iconClasses: {
        success: "success",
        error: "error",
      }
    }),
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, refreshInterceptor])
    )
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
