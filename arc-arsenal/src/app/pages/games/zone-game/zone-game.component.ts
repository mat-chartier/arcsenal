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
  selector: 'app-zone-game',
  standalone: true,
  imports: [CommonModule, FormsModule, ScoreKeyboardComponent, SettingsComponent, PastGamesComponent, FontAwesomeModule],
  templateUrl: './zone-game.component.html',
  styleUrl: './zone-game.component.scss',
})
export class ZoneGameComponent {
  readonly localStorageItemName = 'ZoneGame';
  reloadPastGamesEventEmitter: EventEmitter<void> = new EventEmitter<void>();

  faRotateLeft = faRotateLeft;
  faInfo = faInfo;
  helpModalOpen: boolean = false;


  startDate: Date | null = null;
  arrowsPerEndCount: number = 9;
  successZone: number = 7;
  gameStarted: boolean = false;
  gameFinished: boolean = false;
  currentEnd: (number | 'X' | 'M')[] = [];
  currentEndIndex: number = 0;
  pastEnds: {
    details: (number | 'X' | 'M')[];
    score: number;
  }[] = [];
  currentGameId: any = null;

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

  async onNewSettings(settings: any | null) {
    if (settings) {
      this.successZone = settings.successZone;
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

  addScore(score: number | 'X' | 'M') {
    if (this.currentEnd.length < this.arrowsPerEndCount) {
      this.currentEnd.push(score);

      if (this.currentEnd.length === this.arrowsPerEndCount) {
        this.saveCurrentEnd();
      }
    }
  }

  async saveCurrentEnd() {
    const score = this.calculateScore(this.currentEnd);

    this.pastEnds.push({
      details: [...this.currentEnd],
      score,
    });

    this.currentEnd = [];
    this.currentEndIndex++;
    this.gameFinished = this.getTotalScore() >= 20;

    const gameData = this.getGameData();
    await this.gameService.saveCurrentGame(gameData, this.localStorageItemName);
    
    this.currentGameId = gameData.id;

    await this.gameService.addOrUpdatePastGame(gameData, this.localStorageItemName);
  }

  getScoreClass = getScoreClass;

  calculateScore(scores: (number | 'X' | 'M')[]): number {
    const arrowsInZoneCount = scores.reduce((total: number, s) => {
      if (s == 'M') s = 0;
      if (s == 'X') s = 11;
      if (s < this.successZone) return total;
      return total + 1;
    }, 0);
    if (arrowsInZoneCount >= 9) return 4;
    if (arrowsInZoneCount >= 8) return 2;
    if (arrowsInZoneCount >= 7) return 1;
    if (arrowsInZoneCount >= 6) return 0;
    if (arrowsInZoneCount >= 5) return -1;
    return -2;
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
      id: this.currentGameId,
      startDate: this.startDate,
      arrowsPerEndCount: this.arrowsPerEndCount,
      successZone: this.successZone,
      currentEnd: this.currentEnd,
      currentEndIndex: this.currentEndIndex,
      pastEnds: this.pastEnds,
    };
  }

  loadGame(gameData: any) {
    if (gameData.startDate.toDate) {
      this.startDate = new Date(gameData.startDate.toDate());
    } else {
      this.startDate = new Date(gameData.startDate);
    }
    this.currentGameId = gameData.id;
    this.arrowsPerEndCount = gameData.arrowsPerEndCount;
    this.successZone = gameData.successZone;
    this.currentEnd = gameData.currentEnd || [];
    this.currentEndIndex = gameData.currentEndIndex || 0;
    this.pastEnds = gameData.pastEnds || [];
    this.gameStarted = true;
    this.gameFinished = this.getTotalScore() >= 20;
  }
}
