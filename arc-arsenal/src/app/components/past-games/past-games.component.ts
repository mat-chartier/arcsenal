import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-past-games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './past-games.component.html'
})
export class PastGamesComponent implements OnInit, OnDestroy {
  @Input() localStorageItemName: string | null = null;
  @Input() reloadPastGamesTrigger: EventEmitter<void> = new EventEmitter<void>();
  @Output() viewGame = new EventEmitter<any>();

  authDone = false; // To track if the user is authenticated
  pastGames: any[] = []; // Declare a property to hold the games
  private reloadSubscription: Subscription | undefined; // To manage the subscription

  constructor(private gameService: GameService, private authService: AuthService) { }

  // OnInit to load data when the component initializes
  async ngOnInit() {
    await this.authService.waitForAuth(); // Ensure user is authenticated before loading games
    await this.loadGamesData();
    if (this.reloadPastGamesTrigger) {
      this.reloadSubscription = this.reloadPastGamesTrigger.subscribe(async () => {
        // This callback is executed ONLY when the parent calls .emit() on reloadEventEmitter
        await this.loadGamesData();
        this.authDone = true;
      });
    }
    this.authDone = true; // Set authDone to true after loading user data
  }

  ngOnDestroy(): void {
    // This prevents memory leaks if the component is removed by *ngIf.
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
    this.authDone = false; // Reset authDone when the component is destroyed
  }

  private async loadGamesData() {
    if (this.localStorageItemName) {
      this.pastGames = await this.gameService.loadPastGames(this.localStorageItemName);
    } else {
      this.pastGames = [];
    }
  }

  async deletePastGame(gameToDelete: any) {
    if (!this.localStorageItemName) return;
    await this.gameService.deletePastGame(gameToDelete.id, this.localStorageItemName);
    // After deletion, refresh the list of games
    this.loadGamesData();
  }
}