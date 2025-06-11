import { Injectable } from '@angular/core';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../main';

@Injectable({ providedIn: 'root' })
export class UserService {
  profile: { prenom: string, nom: string, email: string, photoURL?: string } | null = null;
  localStorageKey = 'userProfile';

  async loadUserProfile(uid: string, profileData?: { prenom: string, nom: string, email: string, photoURL?: string }) {
    const localProfile = localStorage.getItem(this.localStorageKey);
    if (localProfile) {
      this.profile = JSON.parse(localProfile);
      return;
    }

    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists() && profileData) {
      await setDoc(userRef, profileData);
      this.profile = profileData;
    } else if (docSnap.exists()) {
      this.profile = docSnap.data() as any;
    } else {
      this.profile = null;
    }

    // Save profile to localStorage
    if (this.profile) {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.profile));
    }
  }

  clearProfile() {
    this.profile = null;
    localStorage.removeItem(this.localStorageKey);
  }
}
