import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login-form.component.html'
})
export class LoginFormComponent {
    @Output() loginSuccess = new EventEmitter<void>();
    email = '';
    password = '';
    showEmailForm = false;

    constructor(public auth: AuthService) { }

    async loginWithGoogle() {
        await this.auth.loginWithGoogle();
        this.loginSuccess.emit();
    }

    async loginWithEmail() {
        try {
            await this.auth.loginWithEmail(this.email, this.password);
            this.loginSuccess.emit();
        } catch (e) {
            alert('Erreur : ' + (e as any).message);
        }
    }

    async registerWithEmail() {
        try {
            await this.auth.registerWithEmail(this.email, this.password);
            this.loginSuccess.emit();
        } catch (e) {
            alert('Erreur : ' + (e as any).message);
        }
    }
}
