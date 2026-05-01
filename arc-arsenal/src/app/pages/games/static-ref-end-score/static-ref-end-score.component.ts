import { CommonModule } from '@angular/common';
import { Component, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInfo, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { PastGamesComponent } from "../../../components/past-games/past-games.component";
import { ScoreKeyboardComponent } from '../../../components/score-input/keyboard/keyboard.component';
import { SettingsComponent } from "../../../components/settings/settings.component";
import { AuthService } from '../../../services/auth.service';
import { GameService } from '../../../services/game.service';
import { getScoreClass } from '../../../utils/score-utils';

@Component({
  standalone: true,
  selector: 'app-static-ref-end-score',
  imports: [CommonModule, FormsModule, SettingsComponent, ScoreKeyboardComponent, FontAwesomeModule, PastGamesComponent],
  templateUrl: './static-ref-end-score.component.html',
  styleUrl: './static-ref-end-score.component.scss'
})
export class StaticRefEndScoreComponent {
  readonly localStorageItemName = 'staticRefScoreGame';
  reloadPastGamesEventEmitter: EventEmitter<void> = new EventEmitter<void>();

  faRotateLeft = faRotateLeft;
  faInfo = faInfo;
  helpModalOpen: boolean = false;

  startDate: Date | null = null;
  arrowsPerEndShotCount: number = 6;
  endsCount: number = 6;
  referenceScore: number = 45;
  gameStarted: boolean = false;
  gameFinished: boolean = false;
  currentEnd: (number | 'X' | 'M')[] = [];
  currentEndIndex: number = 0;
  pastEnds: {
    details: (number | 'X' | 'M')[];
    score: number;
    points: number;
    cumulativePoints: number;
  }[] = [];

  constructor(private gameService: GameService, private authService: AuthService) { }

  ngOnDestroy(): void {
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

  async resetGame() {
    this.gameStarted = false;
    this.gameFinished = false;
    this.currentEnd = [];
    this.pastEnds = [];
    await this.gameService.resetCurrentGame(this.localStorageItemName);
    this.reloadPastGamesEventEmitter.emit();
  }

  async onNewSettings(settings: any | null) {
    if (settings) {
      this.arrowsPerEndShotCount = settings.arrowsPerEndShotCount;
      this.endsCount = settings.endsCount;
      this.referenceScore = settings.referenceScore;
      this.startGame();
    } else {
      await this.resetGame();
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
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 50);
    }
  }

  removeLastScore() {
    if (this.currentEnd.length > 0) {
      this.currentEnd.pop();
    }
  }

  calculateEndPoints(endScore: number): number {
    const diff = endScore - this.referenceScore;
    if (diff >= 4) return 2;
    if (diff >= 2) return 1;
    if (diff >= -1) return 0;
    if (diff >= -3) return -1;
    return -2;
  }

  get totalPoints(): number {
    return this.pastEnds.reduce((sum, e) => sum + e.points, 0);
  }

  async saveCurrentEnd() {
    const total = this.calculateScoreSum(this.currentEnd);
    const points = this.calculateEndPoints(total);
    const cumulativePoints = this.totalPoints + points;

    this.pastEnds.push({ details: [...this.currentEnd], score: total, points, cumulativePoints });

    this.currentEndIndex++;
    this.currentEnd = [];
    this.gameFinished = this.currentEndIndex >= this.endsCount;

    await this.gameService.saveCurrentGame(this.getGameData(), this.localStorageItemName);

    if (this.gameFinished) {
      await this.gameService.addOrUpdatePastGame(this.getGameData(), this.localStorageItemName);
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
