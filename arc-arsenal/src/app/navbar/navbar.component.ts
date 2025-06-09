import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user-service';
import { LoginFormComponent } from "../components/login-form/login-form.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginFormComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isNavbarActive = false;
  authDone = false;
  showLoginForm = false;
  constructor(public auth: AuthService, public userService: UserService) { }

  async ngOnInit() {
    this.showLoginForm = false;
    await this.auth.waitForAuth();
    if (this.auth.user) {
      await this.userService.loadUserProfile(this.auth.user?.uid || '');
    }
    this.authDone = true;
  }

  toggleNavbar() {
    this.isNavbarActive = !this.isNavbarActive;
  }

  closeNavbar() {
    this.isNavbarActive = false;
  }
}
