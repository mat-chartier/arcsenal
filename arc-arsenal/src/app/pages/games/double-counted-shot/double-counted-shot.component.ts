import { CommonModule } from '@angular/common';
import { Component, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { PastGamesComponent } from "../../../components/past-games/past-games.component";
import { ScoreKeyboardComponent } from '../../../components/score-input/keyboard/keyboard.component';
import { SettingsComponent } from "../../../components/settings/settings.component";
import { getScoreClass } from '../../../utils/score-utils';
import { GameService } from '../../../services/game.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-tir-compte-double',
  standalone: true,
  imports: [CommonModule, FormsModule, ScoreKeyboardComponent, FontAwesomeModule, SettingsComponent, PastGamesComponent],
  templateUrl: './double-counted-shot.component.html',
  styleUrl: './double-counted-shot.component.scss',
})
export class DoubleCountedShotGameComponent {
  reloadPastGamesEventEmitter: EventEmitter<void> = new EventEmitter<void>();

  faRotateLeft = faRotateLeft;

  startDate: Date | null = null;
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

  readonly localStorageItemName = 'doubleCountedGame';

  constructor(private gameService: GameService, private authService: AuthService) { }

  ngOnDestroy(): void {
    // Clean up any subscriptions or resources if necessary
    this.reloadPastGamesEventEmitter.complete();
  }

  async onNewSettings(settings: any | null) {
    if (settings) {
      this.arrowsPerEndShotCount = settings.arrowsPerEndShotCount;
      this.arrowsPerEndCount = settings.arrowsPerEndCount!;
      this.endsCount = settings.endsCount;
      this.startGame();
    } else {
      await this.resetGame();
    }
  }
  startGame() {
    this.startDate = new Date();
    this.gameStarted = true;
    this.currentEnd = [];
    this.currentEndIndex = 0;
    this.pastEnds = [];
  }

  async resetGame() {
    this.gameStarted = false;
    this.gameFinished = false;
    this.currentEnd = [];
    this.pastEnds = [];
    await this.gameService.resetCurrentGame(this.localStorageItemName);
    this.reloadPastGamesEventEmitter.emit();
  }

  async addScore(score: number | 'X' | 'M') {
    if (this.currentEnd.length < this.arrowsPerEndShotCount) {
      this.currentEnd.push(score);

      if (this.currentEnd.length === this.arrowsPerEndShotCount) {
        await this.saveCurrentEnd();
      }
    }
  }

  async saveCurrentEnd() {
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
    this.gameFinished = this.currentEndIndex >= this.endsCount;
    
    await this.gameService.saveCurrentGame(this.getGameData(), this.localStorageItemName);

    if (this.gameFinished) {
      await this.gameService.addOrUpdatePastGame(this.getGameData(), this.localStorageItemName);
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

  getGameData() {
    return {
      startDate: this.startDate,
      arrowsPerEndCount: this.arrowsPerEndCount,
      endsCount: this.endsCount,
      currentEnd: this.currentEnd,
      currentEndIndex: this.currentEndIndex,
      pastEnds: this.pastEnds,
      gameStarted: this.gameStarted,
      gameFinished: this.gameFinished,
    };
  }

  loadGame(data: any) {
    this.startDate = data.startDate;
    this.arrowsPerEndShotCount = data.arrowsPerEndCount;
    this.endsCount = data.endsCount;
    this.currentEnd = data.currentEnd;
    this.currentEndIndex = data.currentEndIndex;
    this.pastEnds = data.pastEnds;
    this.gameStarted = data.gameStarted;
    this.gameFinished = this.currentEndIndex >= this.endsCount;
  }

   async ngOnInit() {
    await this.authService.waitForAuth();
    const currentGame = await this.gameService.loadCurrentGame(this.localStorageItemName);
    if (currentGame) {
      this.loadGame(currentGame);
    }
  }
}
