import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {

  okLogin: boolean = false;

  get email() {
    return this.loginForm?.get('email');
  }

  get password() {
    return this.loginForm?.get('password');
  }

  constructor(private router: Router, private localStorageService: LocalStorageService) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  ngOnInit() {}

  onSubmit() {
    const username = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    if (username === 'user@gmail.com' && password === '123456') {
      this.localStorageService.setItem('token', 'your-auth-token');
      this.okLogin = false;
      this.router.navigateByUrl('/home');
    } else {
      this.okLogin = true;
    }
  }

  getError(campo: string): string {
    switch (campo) {
      case 'email':
        if (this.email?.hasError('required')) {
          return 'Enter an email';
        }
        if (this.email?.hasError('email')) {
          return 'Enter a valid email';
        }
        break;
      case 'password':
        if (this.password?.hasError('required')) {
          return 'Enter a password';
        }
        break;
    }
    return '';
  }
}
