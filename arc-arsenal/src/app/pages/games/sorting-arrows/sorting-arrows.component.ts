import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InteractiveTargetFaceComponent } from '../../../components/score-input/target-face/target-face.component';
import { SettingsComponent } from "../../../components/settings/settings.component";

@Component({
  selector: 'app-sorting-arrows',
  standalone: true,
  imports: [CommonModule, FormsModule, InteractiveTargetFaceComponent, SettingsComponent],
  templateUrl: './sorting-arrows.component.html',
  styleUrl: './sorting-arrows.component.scss'
})
export class SortingArrowsGameComponent {

  mode: 'settings' | 'targetFace' | 'showAll' = 'settings';
  arrowsCount = 6;

  impactsPerArrows: Map<number, { x: number, y: number }[]> = new Map();

  lastImpact: { x: number, y: number } | null = null;
  pastImpacts: { index: number, impact: { x: number, y: number } }[] = [];

  showModal = false;

  private readonly localStorageItemName = 'tri-de-fleches';

  ngOnInit() {
    this.initImpacts();
  }

  initImpacts() {
    const dataStr = localStorage.getItem(this.localStorageItemName);
    if (dataStr === null) {
      this.impactsPerArrows = new Map();
      for (let i = 1; i <= this.arrowsCount; i++) {
        this.impactsPerArrows.set(i, []);
      }

    } else {
      const data: { arrowsCount: number, impactsPerArrows: any } | null = JSON.parse(dataStr);
      if (data != null) {
        console.log(data);
        this.arrowsCount = data.arrowsCount;
        this.impactsPerArrows = new Map(data.impactsPerArrows);
        this.mode = 'targetFace';
      }
    }
  }

  onNewSettings(settings: any | null) {
    if (settings) {
      this.arrowsCount = settings.arrowsPerEndShotCount;
      this.startGame();
    } else {
      this.resetGame();
    }
  }
  startGame() {
    if (this.arrowsCount >= 1) {
      this.initImpacts();
      this.mode = 'targetFace';
    }
  }

  getAllImpacts(): { x: number, y: number, arrow: number }[] {
    if (this.impactsPerArrows) {
      return Array.from(this.impactsPerArrows.entries()).flatMap(([arrowKey, coordinatesArray]) => {
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

  /* Get all arrow indices from 1 to arrowsCount
   * @returns {number[]} An array of arrow indices
   */
  getAllArrowsIndices() {
    return Array.from({ length: this.arrowsCount }, (_, i) => i + 1);
  }

  arrowsAverage(): { x: number, y: number, arrow: number }[] {
    if (this.impactsPerArrows) {
      return this.getAllArrowsIndices()
        .map(n => this.average(this.impactsPerArrows.get(n)!, n))
        .filter((m): m is { x: number, y: number, arrow: number } => m !== null);
    }
    return [];
  }

  onNewImpact(impact: { x: number, y: number }) {
    this.lastImpact = impact;
    this.showModal = true;
  }

  associateImpactToArrow(numero: number) {
    this.impactsPerArrows.get(numero)?.push(this.lastImpact!);
    this.pastImpacts.push({ index: numero, impact: this.lastImpact! });
    this.lastImpact = null;
    this.showModal = false;
    this.save();
  }

  cancelImpactAssociation() {
    this.lastImpact = null;
    this.showModal = false;
    this.save();
  }

  cancelLastImpact() {
    const dernier = this.pastImpacts.pop();
    if (dernier) {
      const impactsList = this.impactsPerArrows.get(dernier.index);
      if (impactsList) {
        // Remove last corresponding impact (last impact for this given arrow)
        impactsList.pop();
        this.save();
      }
    }
  }

  showAllImpacts() {
    this.mode = 'showAll';
  }

  average(impacts: { x: number, y: number }[], n: number) {
    if (impacts.length === 0) return null;
    const sumX = impacts.reduce((acc, val) => acc + val.x, 0);
    const sumY = impacts.reduce((acc, val) => acc + val.y, 0);
    return { x: sumX / impacts.length, y: sumY / impacts.length, arrow: n };
  }

  globalAverage() {
    const allAverages = Array.from(this.impactsPerArrows.values())
      .map(impacts => this.average(impacts, 0))
      .filter(m => m);

    if (allAverages.length === 0) return null;

    const sumX = allAverages.reduce((acc, m) => acc + m!.x, 0);
    const sumY = allAverages.reduce((acc, m) => acc + m!.y, 0);

    return [{
      x: sumX / allAverages.length,
      y: sumY / allAverages.length,
      arrow: 0
    }];
  }

  resetGame() {
    this.arrowsCount = 6;
    this.mode = 'settings';
    if (this.impactsPerArrows) {
      this.impactsPerArrows.clear();
    }
    localStorage.removeItem(this.localStorageItemName);
  }

  save() {
    const data = {
      arrowsCount: this.arrowsCount,
      impactsPerArrows: Array.from(this.impactsPerArrows.entries())
    };
    localStorage.setItem(this.localStorageItemName, JSON.stringify(data));
  }
}
