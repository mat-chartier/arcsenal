import { Routes } from '@angular/router';
import { GoldGameComponent } from './pages/gold-game/gold-game.component';
import { TirCompteDoubleComponent } from './pages/tir-compte-double/tir-compte-double.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { TriDeFlechesComponent } from './pages/tri-de-fleches/tri-de-fleches.component';
import { TirCompteSimpleComponent } from './pages/tir-compte-simple/tir-compte-simple.component';

export const routes: Routes = [
  { path: 'tir-compte-simple', component: TirCompteSimpleComponent },
  { path: 'gold-game', component: GoldGameComponent },
  { path: 'tir-compte-double', component: TirCompteDoubleComponent },
  { path: 'accueil', component: AccueilComponent },
  { path: 'tri-de-fleches', component: TriDeFlechesComponent },
  { path: '', redirectTo: 'accueil', pathMatch: 'full' }, // optionnel: page par défaut
  { path: '**', redirectTo: 'accueil' }
];
