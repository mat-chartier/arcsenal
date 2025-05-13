import { Routes } from '@angular/router';
import { GoldGameComponent } from './pages/gold-game/gold-game.component';
import { TirCompteDoubleComponent } from './pages/tir-compte-double/tir-compte-double.component';
import { AccueilComponent } from './pages/accueil/accueil.component';

export const routes: Routes = [
      { path: 'gold-game', component: GoldGameComponent },
  { path: 'tir-compte-double', component: TirCompteDoubleComponent },
  { path: 'accueil', component: AccueilComponent},
  { path: '', redirectTo: 'accueil', pathMatch: 'full' }, // optionnel: page par défaut
  { path: '**', redirectTo: 'accueil' }
];
