import { Injectable } from '@angular/core';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { AuthService } from './auth.service';
import { CompetitionPlan } from '../pages/competition-plan/competition-plan.component';
import { db } from '../../main';

const LOCAL_KEY = 'competitionPlans';

@Injectable({ providedIn: 'root' })
export class CompetitionPlanStorageService {

  constructor(private auth: AuthService) {}

  private get isConnected() {
    return !!this.auth.user;
  }

  private get firestoreRef() {
    return doc(db, `users/${this.auth.user!.uid}/plans/competitionPlans`);
  }

  async loadPlans(): Promise<CompetitionPlan[]> {
    if (this.isConnected) {
      try {
        const snap = await getDoc(this.firestoreRef);
        return snap.exists() ? (snap.data()['plans'] ?? []) : [];
      } catch (e) {
        console.error('Error loading competition plans:', e);
        return [];
      }
    } else {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : [];
    }
  }

  async savePlans(plans: CompetitionPlan[]): Promise<void> {
    if (this.isConnected) {
      try {
        const snap = await getDoc(this.firestoreRef);
        if (snap.exists()) {
          await updateDoc(this.firestoreRef, { plans });
        } else {
          await setDoc(this.firestoreRef, { plans });
        }
      } catch (e) {
        console.error('Error saving competition plans:', e);
      }
    } else {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(plans));
    }
  }
}
