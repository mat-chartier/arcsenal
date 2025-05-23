import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScoreKeyboardComponent } from '../../components/score-keyboard/score-keyboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBackward, faRotateLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tir-compte-double',
  standalone: true,
  imports: [CommonModule, FormsModule, ScoreKeyboardComponent, FontAwesomeModule],
  templateUrl: './tir-compte-simple.component.html',
  styleUrl: './tir-compte-simple.component.scss',
})
export class TirCompteSimpleComponent {
  faRotateLeft = faRotateLeft;

  nbFlechesParVolee: number = 6;
  nbVolees: number = 6;
  gameStarted: boolean = false;
  gameFinished: boolean = false;
  currentVolee: (number | 'X' | 'M')[] = [];
  currentVoleeIndex: number = 0;
  historiqueVolees: {
    details: (number | 'X' | 'M')[];
    total: number;
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

  private readonly localStorageName = 'tirCompteSimpleGame';

  startGame() {
    this.gameStarted = true;
    this.currentVolee = [];
    this.currentVoleeIndex = 0;
    this.historiqueVolees = [];
  }

  resetGame() {
    this.gameStarted = false;
    this.gameFinished = false;
    this.nbFlechesParVolee = 6;
    this.nbVolees = 6;
    this.currentVolee = [];
    this.historiqueVolees = [];
    localStorage.removeItem('tirCompteDoubleGame');
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

    const total = this.calculateScoreSum(this.currentVolee);

    this.historiqueVolees.push({
      details: [...this.currentVolee],
      total,
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
      return 'yellow';
    if (score === 7 || score === 8)
      return 'red';
    if (score === 5 || score === 6) return 'blue';
    if (score === 3 || score === 4)
      return 'black';
    if (score === 2 || score === 1)
      return 'white';
    if (score === 'M') return 'gray';
    return '';
  }

  calculateScoreSum(scores: (number | 'X' | 'M')[]): number {
    return scores.reduce((total: number, s) => {
      if (s === 'X') return total + 10;
      if (s === 'M') return total;
      return total + (s as number);
    }, 0);
  }

  getTotalCumule(): string {
    if (this.historiqueVolees && this.historiqueVolees.length > 1) {
      return "" + this.historiqueVolees.map(v => v.total).reduce((p, v) => p + v);
    }
    return "";
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
  
  removeLastScore() {
    if (this.currentVolee.length > 0) {
      this.currentVolee.pop();
    }
  }
  saveToLocalStorage() {
    const data = {
      nbFlechesParVolee: this.nbFlechesParVolee,
      nbVolees: this.nbVolees,
      currentVolee: this.currentVolee,
      currentVoleeIndex: this.currentVoleeIndex,
      historiqueVolees: this.historiqueVolees,
    };
    localStorage.setItem(this.localStorageName, JSON.stringify(data));
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem(this.localStorageName);
    if (saved) {
      const data = JSON.parse(saved);
      this.nbFlechesParVolee = data.nbFlechesParVolee;
      this.nbVolees = data.nbVolees;
      this.currentVolee = data.currentVolee;
      this.currentVoleeIndex = data.currentVoleeIndex;
      this.historiqueVolees = data.historiqueVolees;
      this.gameStarted = true;
      this.gameFinished = this.currentVoleeIndex >= this.nbVolees;
    }
  }

  ngOnInit() {
    this.loadFromLocalStorage();
  }
}
