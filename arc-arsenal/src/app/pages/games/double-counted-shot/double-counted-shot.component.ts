import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScoreKeyboardComponent } from '../../../components/score-input/keyboard/keyboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBackward, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { SettingsComponent } from "../../../components/settings/settings.component";
import { getScoreClass } from '../../../utils/score-utils';

@Component({
  selector: 'app-tir-compte-double',
  standalone: true,
  imports: [CommonModule, FormsModule, ScoreKeyboardComponent, FontAwesomeModule, SettingsComponent],
  templateUrl: './double-counted-shot.component.html',
  styleUrl: './double-counted-shot.component.scss',
})
export class DoubleCountedShotGameComponent {

  faRotateLeft = faRotateLeft;

  arrowsPerEndShotCount: number = 7;
  arrowsPerEndCount: number = 6; // This is the number of arrows per end to use for counting the end, not the shot count
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


  onNewSettings(settings: any | null) {
    if (settings) {
      this.arrowsPerEndShotCount = settings.arrowsPerEndShotCount;
      this.arrowsPerEndCount = settings.arrowsPerEndCount!;
      this.endsCount = settings.endsCount;
      this.startGame();
    } else {
      this.resetGame();
    }
  }
  startGame() {
    this.gameStarted = true;
    this.currentEnd = [];
    this.currentEndIndex = 0;
    this.pastEnds = [];
  }

  resetGame() {
    this.gameStarted = false;
    this.gameFinished = false;
    this.currentEnd = [];
    this.pastEnds = [];
    localStorage.removeItem(this.localStorageItemName);
  }

  addScore(score: number | 'X' | 'M') {
    if (this.currentEnd.length < this.arrowsPerEndShotCount) {
      this.currentEnd.push(score);

      if (this.currentEnd.length === this.arrowsPerEndShotCount) {
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

    const bestScore = this.calculateScoreSum(sortedScores.slice(0, this.arrowsPerEndCount));
    const lowestScore = this.calculateScoreSum(sortedScores.slice(-1 * this.arrowsPerEndCount));

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

  getScoreClass = getScoreClass;

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

  removeLastScore() {
    if (this.currentEnd.length > 0) {
      this.currentEnd.pop();
    }
  }
  saveToLocalStorage() {
    const data = {
      arrowsPerEndCount: this.arrowsPerEndShotCount,
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
      this.arrowsPerEndShotCount = data.arrowsPerEndCount;
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
