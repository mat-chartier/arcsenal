import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initializeApp } from 'firebase/app';
import { environment } from './app/firebase-config';
import { getFirestore } from 'firebase/firestore';


initializeApp(environment.firebaseConfig);
export const db = getFirestore();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
