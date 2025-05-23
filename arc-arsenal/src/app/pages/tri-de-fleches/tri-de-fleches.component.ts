import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlasonInteractifComponent } from '../../components/blason-interactif/blason-interactif.component';

@Component({
  selector: 'app-tri-de-fleches',
  standalone: true,
  imports: [CommonModule, FormsModule, BlasonInteractifComponent],
  templateUrl: './tri-de-fleches.component.html',
  styleUrl: './tri-de-fleches.component.scss'
})
export class TriDeFlechesComponent {

  mode: 'parametrage' | 'blason' | 'voirTout' = 'parametrage';
  nbFleches = 6;

  impactsParFleche: Map<number, { x: number, y: number }[]> = new Map();

  dernierImpact: { x: number, y: number } | null = null;
  showModal = false;

  ngOnInit() {
    this.initImpacts();
  }

  initImpacts() {
    const dataStr = localStorage.getItem('tri-de-fleches');
    if (dataStr === null) {
      this.impactsParFleche = new Map();
      for (let i = 1; i <= this.nbFleches; i++) {
        this.impactsParFleche.set(i, []);
      }

    } else {
      const data: { nbFleches: number, impactsParFleche: any } | null = JSON.parse(dataStr);
      if (data != null) {
        console.log(data);
        this.nbFleches = data.nbFleches;
        this.impactsParFleche = new Map(data.impactsParFleche);
        this.mode = 'blason';
      }
    }
  }

  validerParametrage() {
    if (this.nbFleches >= 1) {
      this.initImpacts();
      this.mode = 'blason';
    }
  }

  getAllImpacts(): { x: number, y: number, arrow: number }[] {
    if (this.impactsParFleche) {
      return Array.from(this.impactsParFleche.entries()).flatMap(([arrowKey, coordinatesArray]) => {
        // For each array of coordinates associated with a key (arrowKey),
        // map each coordinate to the new format, adding the 'arrow' property.
        return coordinatesArray.map(coord => ({
          x: coord.x,
          y: coord.y,
          arrow: arrowKey // Use the map's key as the 'arrow' value
        }));
      })
    }
    return [];
  }

  getFlecheNums() {
    return Array.from({ length: this.nbFleches }, (_, i) => i + 1);
  }

  moyennesDesFleches(): { x: number, y: number, arrow: number }[] {
    if (this.impactsParFleche) {
      return this.getFlecheNums()
        .map(n => this.moyenne(this.impactsParFleche.get(n)!, n))
        .filter((m): m is { x: number, y: number, arrow: number } => m !== null);
    }
    return [];
  }

  onNouvelImpact(impact: { x: number, y: number }) {
    this.dernierImpact = impact;
    this.showModal = true;
  }

  affecterImpact(numero: number) {
    this.impactsParFleche.get(numero)?.push(this.dernierImpact!);
    this.dernierImpact = null;
    this.showModal = false;
    this.sauvegarder();
  }

  annulerAffectationImpact() {
    this.dernierImpact = null;
    this.showModal = false;
    this.sauvegarder();
  }

  voirTout() {
    this.mode = 'voirTout';
  }

  moyenne(impacts: { x: number, y: number }[], n: number) {
    if (impacts.length === 0) return null;
    const sumX = impacts.reduce((acc, val) => acc + val.x, 0);
    const sumY = impacts.reduce((acc, val) => acc + val.y, 0);
    return { x: sumX / impacts.length, y: sumY / impacts.length, arrow: n };
  }

  moyenneDesMoyennes() {
    const moyennes = Array.from(this.impactsParFleche.values())
      .map(impacts => this.moyenne(impacts, 0))
      .filter(m => m);

    if (moyennes.length === 0) return null;

    const sumX = moyennes.reduce((acc, m) => acc + m!.x, 0);
    const sumY = moyennes.reduce((acc, m) => acc + m!.y, 0);

    return [{
      x: sumX / moyennes.length,
      y: sumY / moyennes.length,
      arrow: 0
    }];
  }

  relancer() {
    this.nbFleches = 6;
    this.mode = 'parametrage';
    if (this.impactsParFleche) {
      this.impactsParFleche.clear();
    }
    localStorage.removeItem('tri-de-fleches');
  }

  sauvegarder() {
    const data = {
      nbFleches: this.nbFleches,
      impactsParFleche: Array.from(this.impactsParFleche.entries())
    };
    localStorage.setItem('tri-de-fleches', JSON.stringify(data));
  }
}
