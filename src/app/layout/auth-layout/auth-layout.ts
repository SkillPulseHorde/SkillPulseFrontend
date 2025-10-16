import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'auth-layout',
  templateUrl: 'auth-layout.html',
  imports: [
    RouterOutlet,
    NgOptimizedImage
  ],
  styleUrl: 'auth-layout.css'
})

export class AuthLayout { }
