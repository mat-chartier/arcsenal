import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlasonInteractifComponent } from '../../components/blason-interactif/blason-interactif.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBackward } from '@fortawesome/free-solid-svg-icons';

const STORAGE_KEY = 'tri-de-fleches';
@Component({
  selector: 'app-tri-de-fleches',
  standalone: true,
  imports: [CommonModule, FormsModule, BlasonInteractifComponent, FontAwesomeModule],
  templateUrl: './tri-de-fleches.component.html',
  styleUrl: './tri-de-fleches.component.scss'
})
export class TriDeFlechesComponent {

  mode: 'parametrage' | 'grille' | 'detail' | 'tout' = 'parametrage';
  nbFleches = 6;

  impactsParFleche: Map<number, { x: number, y: number }[]> = new Map();
  flecheActive = 0;

  faBackward = faBackward;

  validerParametrage() {
    if (this.nbFleches >= 1) {
      this.impactsParFleche = new Map();
      for (let i = 1; i <= this.nbFleches; i++) {
        this.impactsParFleche.set(i, []);
      }
      this.mode = 'grille';
      this.sauvegarder();
      this.ouvrirDetail(1);
    }
  }

  getFlecheNums() {
    return Array.from({ length: this.nbFleches }, (_, i) => i + 1);
  }

  ouvrirDetail(numero: number) {
    this.flecheActive = numero;
    this.mode = 'detail';
  }

  voirTout() {
    this.mode = 'tout';
  }

  relancer() {
    this.mode = 'parametrage';
    this.nbFleches = 6;
    this.impactsParFleche.clear();
    localStorage.removeItem(STORAGE_KEY);
  }

  ajouterImpact(numero: number, impact: { x: number, y: number }) {
    const liste = this.impactsParFleche.get(numero);
    if (liste) {
      liste.push(impact);
      this.sauvegarder();
    }
  }

  supprimerDerniere(numero: number) {
    const liste = this.impactsParFleche.get(numero);
    if (liste && liste.length > 0) {
      liste.pop();
      this.sauvegarder();
    }
  }

  tousLesImpacts() {
    return Array.from(this.impactsParFleche.values()).flat();
  }

  moyenne(impacts: { x: number, y: number }[]) {
    if (impacts.length === 0) return null;
    const sumX = impacts.reduce((acc, val) => acc + val.x, 0);
    const sumY = impacts.reduce((acc, val) => acc + val.y, 0);
    return { x: sumX / impacts.length, y: sumY / impacts.length };
  }

  sauvegarder() {
    const data = {
      nbFleches: this.nbFleches,
      impacts: Array.from(this.impactsParFleche.entries())
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  ngOnInit() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      this.nbFleches = data.nbFleches;
      this.impactsParFleche = new Map(data.impacts);
      this.mode = 'grille';
      this.ouvrirDetail(1);
    }
  }

}
