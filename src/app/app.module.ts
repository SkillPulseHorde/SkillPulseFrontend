import { BrowserModule } from '@angular/platform-browser';
import {NgModule, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';

import { AppComponent } from './app.component';

import { StoreModule } from '@ngrx/store';
import {authReducer} from './features/auth/store/auth.reducers';
import {provideRouter, RouterOutlet} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {routes} from "./app.routes";
import {userReducer} from './features/user/store/user.reducers';
import {authInterceptor} from './features/auth/api/auth.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterOutlet,
    StoreModule.forRoot({ auth: authReducer, user: userReducer }),
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
