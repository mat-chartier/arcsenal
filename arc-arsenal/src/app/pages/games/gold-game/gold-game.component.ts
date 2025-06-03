import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScoreKeyboardComponent } from '../../../components/score-input/keyboard/keyboard.component';

@Component({
  selector: 'app-gold-game',
  standalone: true,
  imports: [CommonModule, FormsModule, ScoreKeyboardComponent],
  templateUrl: './gold-game.component.html',
  styleUrl: './gold-game.component.scss',
})
export class GoldGameComponent {
 readonly localStorageItemName = 'GoldGame';

  arrowsPerEndCount: number = 7;
  endsCount: number = 6;
  successZone: number = 7;
  gameStarted: boolean = false;
  gameFinished: boolean = false;
  currentEnd: (number | 'X' | 'M')[] = [];
  currentEndIndex: number = 0;
  pastEnds: {
    details: (number | 'X' | 'M')[];
    score: number;
  }[] = [];

  startGame() {
    this.gameStarted = true;
    this.currentEnd = [];
    this.currentEndIndex = 0;
    this.pastEnds = [];
  }

  resetGame() {
    this.gameStarted = false;
    this.gameFinished = false;
    this.arrowsPerEndCount = 7;
    this.endsCount = 6;
    this.currentEnd = [];
    this.pastEnds = [];
    localStorage.removeItem(this.localStorageItemName);
  }

  addScore(score: number | 'X' | 'M') {
    if (this.currentEnd.length < this.arrowsPerEndCount) {
      this.currentEnd.push(score);

      if (this.currentEnd.length === this.arrowsPerEndCount) {
        this.saveCurrentVolee();
      }
    }
  }

  saveCurrentVolee() {
    const score = this.calculateScore(this.currentEnd);

    this.pastEnds.push({
      details: [...this.currentEnd],
      score,
    });

    this.currentEnd = [];
    this.currentEndIndex++;

    if (this.currentEndIndex >= this.endsCount) {
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

  calculateScore(scores: (number | 'X' | 'M')[]): number {
    return scores.reduce((total: number, s) => {
      if (s == 'M') s = 0;
      if (s == 'X') s = 11;
      if (s == this.successZone) return total;
      if (s == this.successZone + 1) return total + 1;
      if (s > this.successZone + 1) return total + 2;
      return total - 1;
    }, 0);
  }

  getTotalScore(): number {
    let total: number = 0;
    this.pastEnds.forEach((hist) => {
      total += hist.score;
    });
    return total;
  }

  getZonePercent(): number {
   return Math.trunc(this.pastEnds.reduce((total:number, hist) => {
      return total + hist.details.reduce((count: number, score) => {
        if (score == 'M') score = 0;
        if (score == 'X') score = 10;
        if (score >= this.successZone) return count + 1;
        return count;
      }, 0);
    }, 0) / (this.currentEndIndex * this.arrowsPerEndCount) * 100);
  }

  incrementFleches() {
    this.arrowsPerEndCount++;
  }

  decrementFleches() {
    if (this.arrowsPerEndCount > 1) {
      this.arrowsPerEndCount--;
    }
  }

  incrementVolees() {
    this.endsCount++;
  }

  decrementVolees() {
    if (this.endsCount > 1) {
      this.endsCount--;
    }
  }

  incrementZone() {
    if (this.successZone < 10) {
      this.successZone++;
    }
  }

  decrementZone() {
    if (this.successZone > 1) {
      this.successZone--;
    }
  }

  removeLastScore() {
  if (this.currentEnd.length > 0) {
    this.currentEnd.pop();
  }
}

  saveToLocalStorage() {
    const data = {
      nbFlechesParVolee: this.arrowsPerEndCount,
      nbVolees: this.endsCount,
      zoneReussite: this.successZone,
      currentVolee: this.currentEnd,
      currentVoleeIndex: this.currentEndIndex,
      historiqueVollees: this.pastEnds,
    };
    localStorage.setItem(this.localStorageItemName, JSON.stringify(data));
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem(this.localStorageItemName);
    if (saved) {
      const data = JSON.parse(saved);
      this.arrowsPerEndCount = data.nbFlechesParVolee;
      this.endsCount = data.nbVolees;
      this.successZone = data.zoneReussite;
      this.currentEnd = data.currentVolee;
      this.currentEndIndex = data.currentVoleeIndex;
      this.pastEnds = data.historiqueVollees;
      this.gameStarted = true;
      this.gameFinished = this.currentEndIndex >= this.endsCount;
    }
  }

  ngOnInit() {
    this.loadFromLocalStorage();
  }
}
