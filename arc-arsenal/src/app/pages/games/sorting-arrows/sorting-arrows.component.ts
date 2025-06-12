import { Component, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InteractiveTargetFaceComponent } from '../../../components/score-input/target-face/target-face.component';
import { SettingsComponent } from "../../../components/settings/settings.component";
import { PastGamesComponent } from "../../../components/past-games/past-games.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { GameService } from '../../../services/game.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sorting-arrows',
  standalone: true,
  imports: [CommonModule, FormsModule, InteractiveTargetFaceComponent, SettingsComponent, PastGamesComponent, FontAwesomeModule],
  templateUrl: './sorting-arrows.component.html',
  styleUrl: './sorting-arrows.component.scss'
})
export class SortingArrowsGameComponent {
  readonly localStorageItemName = 'tri-de-fleches';
  reloadPastGamesEventEmitter: EventEmitter<void> = new EventEmitter<void>();

  mode: 'settings' | 'targetFace' | 'showAll' = 'settings';
  faRotateLeft = faRotateLeft;

  startDate: Date | null = null;
  arrowsCount = 6;
  impactsPerArrows: Map<number, { x: number, y: number }[]> = new Map();
  lastImpact: { x: number, y: number } | null = null;
  pastImpacts: { index: number, impact: { x: number, y: number } }[] = [];
  gameId: any;

  showModal = false;

  constructor(private gameService: GameService, private authService: AuthService) { }

  ngOnDestroy(): void {
    // Clean up any subscriptions or resources if necessary
    this.reloadPastGamesEventEmitter.complete();
  }
  async ngOnInit() {
    await this.authService.waitForAuth();
    this.initImpacts();
  }

  async initImpacts() {
    const currentGame = await this.gameService.loadCurrentGame(this.localStorageItemName);
    if (currentGame) {
      this.loadGame(currentGame);
    } else {
      this.impactsPerArrows = new Map();
      for (let i = 1; i <= this.arrowsCount; i++) {
        this.impactsPerArrows.set(i, []);
      }
    }
  }

  onNewSettings(settings: any) {
    this.arrowsCount = settings.arrowsPerEndShotCount;
    this.startGame();
  }

  startGame() {
    if (this.arrowsCount >= 1) {
      this.initImpacts();
      this.mode = 'targetFace';
      this.startDate = new Date();
      this.gameId = null;
    }
  }

  getAllImpacts(): { x: number, y: number, arrow: number }[] {
    if (this.impactsPerArrows) {
      return Array.from(this.impactsPerArrows.entries()).flatMap(([arrowKey, coordinatesArray]) => {
        // For each array of coordinates associated with a key (arrowKey),
        // map each coordinate to the new format, adding the 'arrow' property.
        return coordinatesArray.map(coord => ({
          x: coord.x,
          y: coord.y,
          arrow: arrowKey // Use the map's key as the 'arrow' value
        }));
      })
    }
    return [];
  }

  /* Get all arrow indices from 1 to arrowsCount
   * @returns {number[]} An array of arrow indices
   */
  getAllArrowsIndices() {
    return Array.from({ length: this.arrowsCount }, (_, i) => i + 1);
  }

  arrowsAverage(): { x: number, y: number, arrow: number }[] {
    if (this.impactsPerArrows) {
      return this.getAllArrowsIndices()
        .map(n => this.average(this.impactsPerArrows.get(n)!, n))
        .filter((m): m is { x: number, y: number, arrow: number } => m !== null);
    }
    return [];
  }

  onNewImpact(impact: { x: number, y: number }) {
    this.lastImpact = impact;
    this.showModal = true;
  }

  async associateImpactToArrow(numero: number) {
    this.impactsPerArrows.get(numero)?.push(this.lastImpact!);
    this.pastImpacts.push({ index: numero, impact: this.lastImpact! });
    this.lastImpact = null;
    this.showModal = false;
    await this.gameService.saveCurrentGame(this.getGameData(), this.localStorageItemName);
  }

  async cancelImpactAssociation() {
    this.lastImpact = null;
    this.showModal = false;
    await this.gameService.saveCurrentGame(this.getGameData(), this.localStorageItemName);
  }

  async cancelLastImpact() {
    const dernier = this.pastImpacts.pop();
    if (dernier) {
      const impactsList = this.impactsPerArrows.get(dernier.index);
      if (impactsList) {
        // Remove last corresponding impact (last impact for this given arrow)
        impactsList.pop();
        await this.gameService.saveCurrentGame(this.getGameData(), this.localStorageItemName);
      }
    }
  }

  showAllImpacts() {
    this.mode = 'showAll';
  }

  average(impacts: { x: number, y: number }[], n: number) {
    if (impacts.length === 0) return null;
    const sumX = impacts.reduce((acc, val) => acc + val.x, 0);
    const sumY = impacts.reduce((acc, val) => acc + val.y, 0);
    return { x: sumX / impacts.length, y: sumY / impacts.length, arrow: n };
  }

  globalAverage() {
    const allAverages = Array.from(this.impactsPerArrows.values())
      .map(impacts => this.average(impacts, 0))
      .filter(m => m);

    if (allAverages.length === 0) return null;

    const sumX = allAverages.reduce((acc, m) => acc + m!.x, 0);
    const sumY = allAverages.reduce((acc, m) => acc + m!.y, 0);

    return [{
      x: sumX / allAverages.length,
      y: sumY / allAverages.length,
      arrow: 0
    }];
  }

  async resetGame() {
    await this.gameService.addOrUpdatePastGame(this.getGameData(), this.localStorageItemName);
    this.arrowsCount = 6;
    this.mode = 'settings';
    if (this.impactsPerArrows) {
      this.impactsPerArrows.clear();
    }
    await this.gameService.resetCurrentGame(this.localStorageItemName);
    this.reloadPastGamesEventEmitter.emit();
  }

  getGameData() {
    const impactsPerArrowsObj: any = {};
    for (const [key, value] of this.impactsPerArrows.entries()) {
      impactsPerArrowsObj[key] = value;
    }

    return {
      id: this.gameId,
      startDate: this.startDate,
      arrowsCount: this.arrowsCount,
      impactsPerArrows: impactsPerArrowsObj,
      lastImpact: this.lastImpact,
      pastImpacts: this.pastImpacts
    };
  }

  loadGame(data: any) {
    const impactsPerArrowsMap = new Map<number, any[]>();
    for (const key of Object.keys(data.impactsPerArrows)) {
      impactsPerArrowsMap.set(+key, data.impactsPerArrows[key]);
    }

    this.gameId = data.id || null;
    this.startDate = data.startDate;
    this.arrowsCount = data.arrowsCount;
    this.impactsPerArrows = impactsPerArrowsMap;
    this.lastImpact = data.lastImpact || null;
    this.pastImpacts = data.pastImpacts || [];
    this.mode = 'targetFace';
  }
}
