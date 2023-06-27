import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private isLoggedIn: boolean = false;

  constructor() { }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  login() {
    this.isLoggedIn = true;
    localStorage.setItem('isLoggedIn', 'true');
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('chartData');
  }

  isAuthenticated() {
    return this.isLoggedIn;
  }
}
