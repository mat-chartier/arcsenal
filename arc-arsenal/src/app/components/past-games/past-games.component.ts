import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { deletePastGame, loadGames } from '../../utils/past-games-utils';

@Component({
  selector: 'app-past-games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './past-games.component.html'
})
export class PastGamesComponent {
  @Input() localStorageItemName: string | null = null;
  @Output() viewGame = new EventEmitter<any>();

  games(): any[] {
    return loadGames(this.localStorageItemName);
  }

  deletePastGame(index: number) {
    if (!this.localStorageItemName) return;
    deletePastGame(this.localStorageItemName, index);
  }
}