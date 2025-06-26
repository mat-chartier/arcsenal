import { Routes } from '@angular/router';
import { GoldGameComponent } from './pages/games/gold-game/gold-game.component';
import { DoubleCountedShotGameComponent } from './pages/games/double-counted-shot/double-counted-shot.component';
import { HomeComponent } from './pages/home/home.component';
import { SortingArrowsGameComponent } from './pages/games/sorting-arrows/sorting-arrows.component';
import { SimpleCountedShotGameComponent } from './pages/games/simple-counted-shot/simple-counted-shot.component';
import { DynamicRefEndScoreComponent } from './pages/games/dynamic-ref-end-score/dynamic-ref-end-score.component';
import { ZoneGameComponent } from './pages/games/zone-game/zone-game.component';

export const routes: Routes = [
  { path: 'tir-compte-simple', component: SimpleCountedShotGameComponent },
  { path: 'gold-game', component: GoldGameComponent },
  { path: 'tir-compte-double', component: DoubleCountedShotGameComponent },
  { path: 'accueil', component: HomeComponent },
  { path: 'tri-de-fleches', component: SortingArrowsGameComponent },
  { path: 'volee-ref-glissante', component: DynamicRefEndScoreComponent },
  { path: 'jeu-de-zone', component: ZoneGameComponent },
    { path: '', redirectTo: 'accueil', pathMatch: 'full' }, // optionnel: page par défaut
  { path: '**', redirectTo: 'accueil' }
];
