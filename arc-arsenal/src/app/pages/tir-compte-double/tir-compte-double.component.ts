import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tir-compte-double',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tir-compte-double.component.html',
  styleUrl: './tir-compte-double.component.scss',
})
export class TirCompteDoubleComponent {
  nbFlechesParVolee: number = 7;
  nbVolees: number = 6;
  gameStarted: boolean = false;
  gameFinished: boolean = false;
  currentVolee: (number | 'X' | 'M')[] = [];
  currentVoleeIndex: number = 0;
  historiqueVollees: {
    details: (number | 'X' | 'M')[];
    meilleuresScore: number;
    moinsBonnesScore: number;
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
    this.historiqueVollees = [];
  }

  resetGame() {
    this.gameStarted = false;
    this.gameFinished = false;
    this.nbFlechesParVolee = 7;
    this.nbVolees = 6;
    this.currentVolee = [];
    this.historiqueVollees = [];
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
    const sortedScores = [...this.currentVolee].sort((a, b) => {
      const valA = a === 'X' ? 10 : a === 'M' ? 0 : a;
      const valB = b === 'X' ? 10 : b === 'M' ? 0 : b;
      return valB - valA;
    });

    const meilleuresScore = this.calculateScoreSum(sortedScores.slice(0, 6));
    const moinsBonnesScore = this.calculateScoreSum(sortedScores.slice(-6));

    this.historiqueVollees.push({
      details: [...this.currentVolee],
      meilleuresScore,
      moinsBonnesScore,
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
    if (score === 'X' || score === 10)
      return 'has-background-warning has-text-black';
    if (score === 9 || score === 8)
      return 'has-background-danger has-text-white';
    if (score === 7 || score === 6) return 'has-background-link has-text-white';
    if (score === 5 || score === 4)
      return 'has-background-black has-text-white';
    if (score === 3 || score === 2 || score === 1)
      return 'has-background-white has-text-black';
    if (score === 'M') return 'has-background-grey-dark has-text-white';
    return '';
  }

  calculateScoreSum(scores: (number | 'X' | 'M')[]): number {
    return scores.reduce((total: number, s) => {
      if (s === 'X') return total + 10;
      if (s === 'M') return total;
      return total + (s as number);
    }, 0);
  }

  getTotalBestScore(): number {
    let total: number = 0;
    this.historiqueVollees.forEach((hist) => {
      total += hist.meilleuresScore;
    });
    return total;
  }

  getTotalWorstScore(): number {
    let total: number = 0;
    this.historiqueVollees.forEach((hist) => {
      total += hist.moinsBonnesScore;
    });
    return total;
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

  saveToLocalStorage() {
    const data = {
      nbFlechesParVolee: this.nbFlechesParVolee,
      nbVolees: this.nbVolees,
      currentVolee: this.currentVolee,
      currentVoleeIndex: this.currentVoleeIndex,
      historiqueVollees: this.historiqueVollees,
    };
    localStorage.setItem('tirCompteDoubleGame', JSON.stringify(data));
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem('tirCompteDoubleGame');
    if (saved) {
      const data = JSON.parse(saved);
      this.nbFlechesParVolee = data.nbFlechesParVolee;
      this.nbVolees = data.nbVolees;
      this.currentVolee = data.currentVolee;
      this.currentVoleeIndex = data.currentVoleeIndex;
      this.historiqueVollees = data.historiqueVollees;
      this.gameStarted = true;
      this.gameFinished = this.currentVoleeIndex >= this.nbVolees;
    }
  }

  ngOnInit() {
    this.loadFromLocalStorage();
  }
}
