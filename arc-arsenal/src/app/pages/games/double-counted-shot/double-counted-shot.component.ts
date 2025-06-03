import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScoreKeyboardComponent } from '../../../components/score-input/keyboard/keyboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBackward, faRotateLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tir-compte-double',
  standalone: true,
  imports: [CommonModule, FormsModule, ScoreKeyboardComponent, FontAwesomeModule],
  templateUrl: './double-counted-shot.component.html',
  styleUrl: './double-counted-shot.component.scss',
})
export class DoubleCountedShotGameComponent {
  faRotateLeft = faRotateLeft;

  arrowsPerEndCount: number = 7;
  endsCount: number = 6;
  gameStarted: boolean = false;
  gameFinished: boolean = false;
  currentEnd: (number | 'X' | 'M')[] = [];
  currentEndIndex: number = 0;
  pastEnds: {
    details: (number | 'X' | 'M')[];
    bestScore: number;
    lowestScore: number;
  }[] = [];

  private readonly localStorageItemName = 'doubleCountedGame';

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
    const sortedScores = [...this.currentEnd].sort((a, b) => {
      const valA = a === 'X' ? 10 : a === 'M' ? 0 : a;
      const valB = b === 'X' ? 10 : b === 'M' ? 0 : b;
      return valB - valA;
    });

    const bestScore = this.calculateScoreSum(sortedScores.slice(0, 6));
    const lowestScore = this.calculateScoreSum(sortedScores.slice(-6));

    this.pastEnds.push({
      details: [...this.currentEnd],
      bestScore: bestScore,
      lowestScore: lowestScore,
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

  calculateScoreSum(scores: (number | 'X' | 'M')[]): number {
    return scores.reduce((total: number, s) => {
      if (s === 'X') return total + 10;
      if (s === 'M') return total;
      return total + (s as number);
    }, 0);
  }

  getTotalBestScore(): number {
    let total: number = 0;
    this.pastEnds.forEach((hist) => {
      total += hist.bestScore;
    });
    return total;
  }

  getTotalLowestScore(): number {
    let total: number = 0;
    this.pastEnds.forEach((hist) => {
      total += hist.lowestScore;
    });
    return total;
  }
  incrementArrowsCount() {
    this.arrowsPerEndCount++;
  }

  decrementArrowsCount() {
    if (this.arrowsPerEndCount > 7) {
      this.arrowsPerEndCount--;
    }
  }

  incrementEndsCount() {
    this.endsCount++;
  }

  decrementEndsCount() {
    if (this.endsCount > 1) {
      this.endsCount--;
    }
  }
  
  removeLastScore() {
    if (this.currentEnd.length > 0) {
      this.currentEnd.pop();
    }
  }
  saveToLocalStorage() {
    const data = {
      arrowsPerEndCount: this.arrowsPerEndCount,
      endsCount: this.endsCount,
      currentEnd: this.currentEnd,
      currentEndIndex: this.currentEndIndex,
      pastEnds: this.pastEnds,
    };
    localStorage.setItem(this.localStorageItemName, JSON.stringify(data));
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem(this.localStorageItemName);
    if (saved) {
      const data = JSON.parse(saved);
      this.arrowsPerEndCount = data.arrowsPerEndCount;
      this.endsCount = data.endsCount;
      this.currentEnd = data.currentEnd;
      this.currentEndIndex = data.currentEndIndex;
      this.pastEnds = data.pastEnds;
      this.gameStarted = true;
      this.gameFinished = this.currentEndIndex >= this.endsCount;
    }
  }

  ngOnInit() {
    this.loadFromLocalStorage();
  }
}
