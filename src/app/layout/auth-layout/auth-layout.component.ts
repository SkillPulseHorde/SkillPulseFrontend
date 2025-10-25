import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'auth-layout',
  templateUrl: 'auth-layout.component.html',
  imports: [
    RouterOutlet,
    NgOptimizedImage
  ],
  styleUrl: 'auth-layout.component.css'
})

export class AuthLayout { }
