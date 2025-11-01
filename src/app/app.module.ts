import { BrowserModule } from '@angular/platform-browser';
import {NgModule, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';

import { AppComponent } from './app.component';

import { StoreModule } from '@ngrx/store';
import {authReducer} from './features/auth/store/auth.reducers';
import {provideRouter, RouterOutlet} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {routes} from "./app.routes";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterOutlet,
    StoreModule.forRoot({ auth: authReducer })
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
