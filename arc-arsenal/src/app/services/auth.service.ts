import { Injectable } from '@angular/core';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, User, getAdditionalUserInfo, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { UserService } from './user-service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private auth = getAuth();
    user: User | null = null;
    private authPromise: Promise<User | null>;
    localStorageKey = 'user';

    constructor(private userService: UserService) {
        this.authPromise = new Promise(resolve => {
            onAuthStateChanged(this.auth, async (user) => {
                this.user = user;
                if (user) {
                    await this.userService.loadUserProfile(user.uid);
                }
                resolve(user);
            });
            getRedirectResult(this.auth).then(result => {
                if (result && result.user) {
                    this.afterGoogleLogin(result);
                }
            });
        });
    }

    async loginWithGoogleDesktop(provider: GoogleAuthProvider) {
        const result = await signInWithPopup(this.auth, provider);
        await this.afterGoogleLogin(result);
    }

    private async afterGoogleLogin(result: any) {
        this.user = result.user;
        if (!this.user) {
            localStorage.removeItem(this.localStorageKey);
            return;
        }
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.user));

        const additionalInfo = getAdditionalUserInfo(result);
        const profile = additionalInfo?.profile as any;
        const profileData = {
            prenom: profile.given_name,
            nom: profile.family_name,
            email: this.user.email!,
            photoURL: this.user.photoURL || ''
        };
        await this.userService.loadUserProfile(this.user.uid, profileData);
    }

    async loginWithGoogle() {
        const provider = new GoogleAuthProvider();

        if (this.isMobile()) {
            await signInWithRedirect(this.auth, provider);
        } else {
            await this.loginWithGoogleDesktop(provider);
        }
    }

    private isMobile(): boolean {
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        return isMobile;
    }

    waitForAuth(): Promise<User | null> {
        const localUser = localStorage.getItem(this.localStorageKey);
        if (localUser) {
            this.user = JSON.parse(localUser);
            return Promise.resolve(this.user);
        }
        return this.authPromise;
    }

    logout() {
        this.userService.clearProfile();
        localStorage.removeItem(this.localStorageKey);
        return signOut(this.auth);
    }

    async registerWithEmail(email: string, password: string) {
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        this.user = userCredential.user;
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.user));
        this.userService.loadUserProfile(this.user.uid, { prenom: email, nom: '', email: email, photoURL: '' });
        return this.user;
    }

    async loginWithEmail(email: string, password: string) {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        this.user = userCredential.user;
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.user));
        this.userService.loadUserProfile(this.user.uid, { prenom: email, nom: '', email: email, photoURL: '' });
        return this.user;
    }
}
