import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isNavbarActive = false;

  toggleNavbar() {
    this.isNavbarActive = !this.isNavbarActive;
  }

  closeNavbar() {
    this.isNavbarActive = false;
  }
}
