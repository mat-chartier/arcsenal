import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { GameStorageService } from './game-storage.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  constructor(private storage: GameStorageService) { }

  async addOrUpdatePastGame(game: any, gameName: string) {
    game.id = game.id || uuidv4();
    await this.storage.addOrUpadtePastGame(game, gameName);
  }

  async deletePastGame(gameId: string, gameName: string) {
    await this.storage.deletePastGame(gameId, gameName);
  }

  async saveCurrentGame(game: any, gameName: string) {
    game.id = game.id || uuidv4();
    await this.storage.saveCurrentGame(game, gameName);
  }

  async loadPastGames(gameName: string) {
    return await this.storage.loadPastGames(gameName);
  }

  async loadCurrentGame(gameName: string) {
    return await this.storage.loadCurrentGame(gameName);
  }

  async resetCurrentGame(gameName: string) {
    await this.storage.resetCurrentGame(gameName);
  }
}
