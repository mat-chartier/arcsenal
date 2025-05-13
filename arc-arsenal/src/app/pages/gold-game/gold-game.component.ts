import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tir-compte-double',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gold-game.component.html',
  styleUrl: './gold-game.component.scss',
})
export class GoldGameComponent {
 readonly localStorageItemName = 'GoldGame';

  nbFlechesParVolee: number = 7;
  nbVolees: number = 6;
  zoneReussite: number = 7;
  gameStarted: boolean = false;
  gameFinished: boolean = false;
  currentVolee: (number | 'X' | 'M')[] = [];
  currentVoleeIndex: number = 0;
  historiqueVolees: {
    details: (number | 'X' | 'M')[];
    score: number;
  }[] = [];

  // Clavier
  scoreValues: (number | 'X' | 'M')[] = [
    'X',
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1,
    'M',
  ];

  startGame() {
    this.gameStarted = true;
    this.currentVolee = [];
    this.currentVoleeIndex = 0;
    this.historiqueVolees = [];
  }

  resetGame() {
    this.gameStarted = false;
    this.gameFinished = false;
    this.nbFlechesParVolee = 7;
    this.nbVolees = 6;
    this.currentVolee = [];
    this.historiqueVolees = [];
    localStorage.removeItem(this.localStorageItemName);
  }

  addScore(score: number | 'X' | 'M') {
    if (this.currentVolee.length < this.nbFlechesParVolee) {
      this.currentVolee.push(score);

      if (this.currentVolee.length === this.nbFlechesParVolee) {
        this.saveCurrentVolee();
      }
    }
  }

  saveCurrentVolee() {
    const score = this.calculateScore(this.currentVolee);

    this.historiqueVolees.push({
      details: [...this.currentVolee],
      score,
    });

    this.currentVolee = [];
    this.currentVoleeIndex++;

    if (this.currentVoleeIndex >= this.nbVolees) {
      this.gameFinished = true;
      console.log('game finished');
    }

    this.saveToLocalStorage();
  }

  getScoreClass(score: number | 'X' | 'M') {
    if (score === 'X' || score === 10 || score === 9)
      return 'has-background-warning has-text-black';
    if (score === 7 || score === 8)
      return 'has-background-danger has-text-white';
    if (score === 5 || score === 6) return 'has-background-link has-text-white';
    if (score === 3 || score === 4)
      return 'has-background-black has-text-white';
    if (score === 2 || score === 1)
      return 'has-background-white has-text-black';
    if (score === 'M') return 'has-background-grey-dark has-text-white';
    return '';
  }

  calculateScore(scores: (number | 'X' | 'M')[]): number {
    return scores.reduce((total: number, s) => {
      if (s == 'M') s = 0;
      if (s == 'X') s = 11;
      if (s == this.zoneReussite) return total;
      if (s == this.zoneReussite + 1) return total + 1;
      if (s > this.zoneReussite + 1) return total + 2;
      return total - 1;
    }, 0);
  }

  getTotalScore(): number {
    let total: number = 0;
    this.historiqueVolees.forEach((hist) => {
      total += hist.score;
    });
    return total;
  }

  getZonePercent(): number {
   return Math.trunc(this.historiqueVolees.reduce((total:number, hist) => {
      return total + hist.details.reduce((count: number, score) => {
        if (score == 'M') score = 0;
        if (score == 'X') score = 10;
        if (score >= this.zoneReussite) return count + 1;
        return count;
      }, 0);
    }, 0) / (this.currentVoleeIndex * this.nbFlechesParVolee) * 100);
  }

  incrementFleches() {
    this.nbFlechesParVolee++;
  }

  decrementFleches() {
    if (this.nbFlechesParVolee > 7) {
      this.nbFlechesParVolee--;
    }
  }

  incrementVolees() {
    this.nbVolees++;
  }

  decrementVolees() {
    if (this.nbVolees > 1) {
      this.nbVolees--;
    }
  }

  incrementZone() {
    if (this.zoneReussite < 10) {
      this.zoneReussite++;
    }
  }

  decrementZone() {
    if (this.zoneReussite > 1) {
      this.zoneReussite--;
    }
  }

  saveToLocalStorage() {
    const data = {
      nbFlechesParVolee: this.nbFlechesParVolee,
      nbVolees: this.nbVolees,
      zoneReussite: this.zoneReussite,
      currentVolee: this.currentVolee,
      currentVoleeIndex: this.currentVoleeIndex,
      historiqueVollees: this.historiqueVolees,
    };
    localStorage.setItem(this.localStorageItemName, JSON.stringify(data));
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem(this.localStorageItemName);
    if (saved) {
      const data = JSON.parse(saved);
      this.nbFlechesParVolee = data.nbFlechesParVolee;
      this.nbVolees = data.nbVolees;
      this.zoneReussite = data.zoneReussite;
      this.currentVolee = data.currentVolee;
      this.currentVoleeIndex = data.currentVoleeIndex;
      this.historiqueVolees = data.historiqueVollees;
      this.gameStarted = true;
      this.gameFinished = this.currentVoleeIndex >= this.nbVolees;
    }
  }

  ngOnInit() {
    this.loadFromLocalStorage();
  }
}
