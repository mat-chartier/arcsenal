import { CommonModule } from '@angular/common';
import { Component, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { PastGamesComponent } from "../../../components/past-games/past-games.component";
import { ScoreKeyboardComponent } from '../../../components/score-input/keyboard/keyboard.component';
import { SettingsComponent } from "../../../components/settings/settings.component";
import { AuthService } from '../../../services/auth.service';
import { GameService } from '../../../services/game.service';
import { getScoreClass } from '../../../utils/score-utils';

@Component({
  standalone: true,
  selector: 'app-dynamic-ref-end-score',
  imports: [CommonModule, FormsModule, SettingsComponent, ScoreKeyboardComponent, FontAwesomeModule, PastGamesComponent],
  templateUrl: './dynamic-ref-end-score.component.html',
  styleUrl: './dynamic-ref-end-score.component.scss'
})
export class DynamicRefEndScoreComponent {
  readonly localStorageItemName = 'dynamicRefScoreGame';
  reloadPastGamesEventEmitter: EventEmitter<void> = new EventEmitter<void>();

  faRotateLeft = faRotateLeft;

  startDate: Date | null = null;
  arrowsPerEndShotCount: number = 6; // This is the number of arrows per end to use for counting the end, not the shot count
  endsCount: number = 6;
  referenceScore: number = 45; // Initial reference score for the first end
  gameStarted: boolean = false;
  gameFinished: boolean = false;
  currentEnd: (number | 'X' | 'M')[] = [];
  currentEndIndex: number = 0;
  pastEnds: {
    details: (number | 'X' | 'M')[];
    score: number;
    refScore: number;
    newRefScore?: number; // Optional new reference score after the end
  }[] = [];

  constructor(private gameService: GameService, private authService: AuthService) { }
  ngOnDestroy(): void {
    // Clean up any subscriptions or resources if necessary
    this.reloadPastGamesEventEmitter.complete();
  }
  async ngOnInit() {
    await this.authService.waitForAuth();
    const currentGame = await this.gameService.loadCurrentGame(this.localStorageItemName);
    if (currentGame) {
      this.loadGame(currentGame);
    }
  }

  startGame() {
    this.startDate = new Date();
    this.gameStarted = true;
    this.gameFinished = false;
    this.currentEnd = [];
    this.currentEndIndex = 0;
    this.pastEnds = [];
  }

  resetGame() {
    this.gameStarted = false;
    this.gameFinished = false;
    this.currentEnd = [];
    this.pastEnds = [];
    this.reloadPastGamesEventEmitter.emit();
    this.gameService.resetCurrentGame(this.localStorageItemName);
  }

  onNewSettings(settings: any | null) {
    if (settings) {
      this.arrowsPerEndShotCount = settings.arrowsPerEndShotCount;
      this.endsCount = settings.endsCount;
      this.referenceScore = settings.referenceScore;
      this.startGame();
    } else {
      this.resetGame();
    }
  }

  getGameData() {
    return {
      startDate: this.startDate,
      arrowsPerEndCount: this.arrowsPerEndShotCount,
      endsCount: this.endsCount,
      referenceScore: this.referenceScore,
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
    this.referenceScore = data.referenceScore;
    this.currentEnd = data.currentEnd || [];
    this.currentEndIndex = data.currentEndIndex || 0;
    this.pastEnds = data.pastEnds || [];
    this.gameStarted = data.gameStarted || false;
    this.gameFinished = data.gameFinished || false;
  }

  getScoreClass = getScoreClass;


  addScore(score: number | 'X' | 'M') {
    if (this.currentEnd.length < this.arrowsPerEndShotCount) {
      this.currentEnd.push(score);

      if (this.currentEnd.length === this.arrowsPerEndShotCount) {
        this.saveCurrentEnd();
      }
    }
  }

  removeLastScore() {
    if (this.currentEnd.length > 0) {
      this.currentEnd.pop();
    }
  }

  saveCurrentEnd() {
    const sortedScores = [...this.currentEnd].sort((a, b) => {
      const valA = a === 'X' ? 10 : a === 'M' ? 0 : a;
      const valB = b === 'X' ? 10 : b === 'M' ? 0 : b;
      return valB - valA;
    });

    const total = this.calculateScoreSum(this.currentEnd);

    const diff = total - this.referenceScore;

    const previousReferenceScore = this.referenceScore;

    // This logic adjusts the reference score based on the difference
    if (diff <= -4) this.referenceScore -= 2;
    else if (diff === -3 || diff === -2) this.referenceScore -= 1;
    else if (diff === 2 || diff === 3) this.referenceScore += 1;
    else if (diff >= 4) this.referenceScore += 2;

    this.pastEnds.push({ score: total, refScore: previousReferenceScore, newRefScore: this.referenceScore, details: [...this.currentEnd] });

    this.currentEndIndex++;
    this.currentEnd = [];

    this.gameService.saveCurrentGame(this.getGameData(), this.localStorageItemName);

    if (this.currentEndIndex >= this.endsCount) {
      this.gameFinished = true;
      this.gameService.addOrUpdatePastGame(this.getGameData(), this.localStorageItemName);
    }
  }

  calculateScoreSum(scores: (number | 'X' | 'M')[]): number {
    return scores.reduce((total: number, s) => {
      if (s === 'X') return total + 10;
      if (s === 'M') return total;
      return total + (s as number);
    }, 0);
  }
}
