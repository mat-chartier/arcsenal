import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScoreKeyboardComponent } from '../../../components/score-input/keyboard/keyboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { SettingsComponent } from "../../../components/settings/settings.component";
import { getScoreClass } from '../../../utils/score-utils';
import { PastGamesComponent } from "../../../components/past-games/past-games.component";
import { addPastGame, resetCurrentGame, saveCurrentGame } from '../../../utils/past-games-utils';

@Component({
  selector: 'app-tir-compte-double',
  standalone: true,
  imports: [CommonModule, FormsModule, ScoreKeyboardComponent, FontAwesomeModule, SettingsComponent, PastGamesComponent],
  templateUrl: './simple-counted-shot.component.html',
  styleUrl: './simple-counted-shot.component.scss',
})
export class SimpleCountedShotGameComponent {

  faRotateLeft = faRotateLeft;

  startDate: Date | null = null;
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

  readonly localStorageItemName = 'simpleCountedShotGame';

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
    this.startDate = new Date();
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

    resetCurrentGame(this.localStorageItemName);
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

    saveCurrentGame(this.getGameData(), this.localStorageItemName);

    if (this.currentEndIndex >= this.endsCount) {
      this.gameFinished = true;
      addPastGame(this.getGameData(), this.localStorageItemName);
    }
  }

  getScoreClass = getScoreClass;

  calculateScoreSum(scores: (number | 'X' | 'M')[]): number {
    return scores.reduce((total: number, s) => {
      if (s === 'X') return total + 10;
      if (s === 'M') return total;
      return total + (s as number);
    }, 0);
  }

  getGrandTotal(i: number): string {
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

  private getGameData() {
    return {
      startDate: this.startDate,
      arrowsPerEndCount: this.arrowsPerEndShotCount,
      endsCount: this.endsCount,
      currentEnd: this.currentEnd,
      currentEndIndex: this.currentEndIndex,
      pastEnds: this.pastEnds,
      gameStarted: this.gameStarted,
      gameFinished: this.gameFinished
    };
  }

  loadGame(game: any) {
    this.startDate = new Date(game.startDate);
    this.arrowsPerEndShotCount = game.arrowsPerEndCount;
    this.endsCount = game.endsCount;
    this.currentEnd = game.currentEnd || [];
    this.currentEndIndex = game.currentEndIndex || 0;
    this.pastEnds = game.pastEnds || [];
    this.gameStarted = true;
    this.gameFinished = this.currentEndIndex >= this.endsCount;
  }

  ngOnInit() {
    const saved = localStorage.getItem(this.localStorageItemName);
    if (saved) {
      const data = JSON.parse(saved).current;
      if (data) {
        this.loadGame(data);
      }
    }
  }
}
