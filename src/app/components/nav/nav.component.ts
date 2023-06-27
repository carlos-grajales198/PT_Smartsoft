import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  isLoggedIn: boolean = false;
  showLeftMenu: boolean = false;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    this.isLoggedIn = isLoggedIn === 'true';
  }

  // Cerrar sesión
  logout() {
    this.localStorageService.logout();
    this.router.navigateByUrl('/login');
  }

  // Ocultar menú
  hide(): void {
    const menu = document.getElementById('menu');
    if (menu) {
      menu.style.left = '-100%';
      this.showLeftMenu = false;
    }
  }

  // Mostrar menú
  show(): void {
    const menu = document.getElementById('menu');
    if (menu) {
      menu.style.left = '0';
      this.showLeftMenu = true;
    } else {
      this.hide();
    }
  }
}
