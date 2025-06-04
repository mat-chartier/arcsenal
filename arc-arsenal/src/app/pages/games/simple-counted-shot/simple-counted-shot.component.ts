import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScoreKeyboardComponent } from '../../../components/score-input/keyboard/keyboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { SettingsComponent } from "../../../components/settings/settings.component";

@Component({
  selector: 'app-tir-compte-double',
  standalone: true,
  imports: [CommonModule, FormsModule, ScoreKeyboardComponent, FontAwesomeModule, SettingsComponent],
  templateUrl: './simple-counted-shot.component.html',
  styleUrl: './simple-counted-shot.component.scss',
})
export class SimpleCountedShotGameComponent {

  @ViewChild(ScoreKeyboardComponent) scoreKeyboard!: ScoreKeyboardComponent;

  faRotateLeft = faRotateLeft;

  arrowsPerEndShotCount: number = 6;
  endsCount: number = 6;
  gameStarted: boolean = false;
  gameFinished: boolean = false;
  currentEnd: (number | 'X' | 'M')[] = [];
  currentEndIndex: number = 0;
  pastEnds: {
    details: (number | 'X' | 'M')[];
    total: number;
  }[] = [];

  private readonly localStorageItemName = 'simpleCountedShotGame';

  onNewSettings(settings: any | null) {
    if (settings) {
      this.arrowsPerEndShotCount = settings.arrowsPerEndShotCount;
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
        this.saveCurrentEnd();
      }
    }
  }

  saveCurrentEnd() {
    const sortedScores = [...this.currentEnd].sort((a, b) => {
      const valA = a === 'X' ? 10 : a === 'M' ? 0 : a;
      const valB = b === 'X' ? 10 : b === 'M' ? 0 : b;
      return valB - valA;
    });

    const total = this.calculateScoreSum(this.currentEnd);

    this.pastEnds.push({
      details: [...this.currentEnd],
      total,
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
    return this.scoreKeyboard.getScoreClass(score);
  }

  calculateScoreSum(scores: (number | 'X' | 'M')[]): number {
    return scores.reduce((total: number, s) => {
      if (s === 'X') return total + 10;
      if (s === 'M') return total;
      return total + (s as number);
    }, 0);
  }

  getTotalCumule(i: number): string {
    if (this.pastEnds && this.pastEnds.length > 1) {
      return "" + this.pastEnds.slice(0, i + 1).map(v => v.total).reduce((p, v) => p + v);
    }
    return "";
  }

  getTotal(): string {
    if (this.pastEnds && this.pastEnds.length > 1) {
      return "" + this.pastEnds.map(v => v.total).reduce((p, v) => p + v);
    }
    return "";
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
