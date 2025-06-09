import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScoreKeyboardComponent } from '../../../components/score-input/keyboard/keyboard.component';
import { SettingsComponent } from "../../../components/settings/settings.component";
import { getScoreClass } from '../../../utils/score-utils';
import { PastGamesComponent } from "../../../components/past-games/past-games.component";
import { addPastGame, resetCurrentGame, saveCurrentGame } from '../../../utils/past-games-utils';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-gold-game',
  standalone: true,
  imports: [CommonModule, FormsModule, ScoreKeyboardComponent, SettingsComponent, PastGamesComponent, FontAwesomeModule],
  templateUrl: './gold-game.component.html',
  styleUrl: './gold-game.component.scss',
})
export class GoldGameComponent {
  readonly localStorageItemName = 'GoldGame';

  faRotateLeft = faRotateLeft;

  startDate: Date | null = null;
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

  onNewSettings(settings: any | null) {
    if (settings) {
      this.arrowsPerEndCount = settings.arrowsPerEndShotCount;
      this.endsCount = settings.endsCount;
      this.successZone = settings.successZone;
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
    if (this.currentEnd.length < this.arrowsPerEndCount) {
      this.currentEnd.push(score);

      if (this.currentEnd.length === this.arrowsPerEndCount) {
        this.saveCurrentEnd();
      }
    }
  }

  saveCurrentEnd() {
    const score = this.calculateScore(this.currentEnd);

    this.pastEnds.push({
      details: [...this.currentEnd],
      score,
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
    return Math.trunc(this.pastEnds.reduce((total: number, hist) => {
      return total + hist.details.reduce((count: number, score) => {
        if (score == 'M') score = 0;
        if (score == 'X') score = 10;
        if (score >= this.successZone) return count + 1;
        return count;
      }, 0);
    }, 0) / (this.currentEndIndex * this.arrowsPerEndCount) * 100);
  }

  removeLastScore() {
    if (this.currentEnd.length > 0) {
      this.currentEnd.pop();
    }
  }

  getGameData() {
    return {
      startDate: this.startDate,
      arrowsPerEndCount: this.arrowsPerEndCount,
      endsCount: this.endsCount,
      successZone: this.successZone,
      currentEnd: this.currentEnd,
      currentEndIndex: this.currentEndIndex,
      pastEnds: this.pastEnds,
    };
  }

  loadGame(gameData: any) {
    this.startDate = new Date(gameData.startDate);
    this.arrowsPerEndCount = gameData.arrowsPerEndCount;
    this.endsCount = gameData.endsCount;
    this.successZone = gameData.successZone;
    this.currentEnd = gameData.currentEnd || [];
    this.currentEndIndex = gameData.currentEndIndex || 0;
    this.pastEnds = gameData.pastEnds || [];
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
