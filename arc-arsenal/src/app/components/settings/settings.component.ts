import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-game-settings',
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  @Input() arrowsPerEndShotCount: number = 7; // Default value, can be overridden by input
  @Input() arrowsPerEndCount?: number; // Default value, can be overridden by input
  @Input() endsCount?: number; // Default value, can be overridden by input
  @Input() minimumArrowsPerEnd: number = 3; // Default value, can be overridden by input
  @Input() successZone?: number; // Default value, can be overridden by input

  @Output() newSettings = new EventEmitter<{ arrowsPerEndShotCount: number, endsCount?: number, arrowsPerEndCount?: number, successZone?: number } | null>();

  incrementArrowsShotCount() {
    this.arrowsPerEndShotCount++;
  }

  decrementArrowsShotCount() {
    if (this.arrowsPerEndShotCount > this.minimumArrowsPerEnd) {
      this.arrowsPerEndShotCount--;
    }
  }

  incrementArrowsCount() {
    if (this.arrowsPerEndCount) {
      this.arrowsPerEndCount++;
    }
  }

  decrementArrowsCount() {
    if (this.arrowsPerEndCount && this.arrowsPerEndCount > this.minimumArrowsPerEnd) {
      this.arrowsPerEndCount--;
    }
  }

  incrementEndsCount() {
    if (this.endsCount) {
      this.endsCount++;
    }
  }

  decrementEndsCount() {
    if (this.endsCount && this.endsCount > 1) {
      this.endsCount--;
    }
  }

  incrementSuccessZone() {
    if (this.successZone) {
      this.successZone++;
    }
  }

  decrementSuccessZone() {
    if (this.successZone && this.successZone > 1) {
      this.successZone--;
    }
  }

  saveSettings() {
    let settings: { arrowsPerEndShotCount: number, endsCount?: number, arrowsPerEndCount?: number, successZone?: number } = {
      arrowsPerEndShotCount: this.arrowsPerEndShotCount,
    };
    if (this.endsCount) {
      settings.endsCount = this.endsCount
    }
    if (this.arrowsPerEndCount !== undefined) {
      settings.arrowsPerEndCount = this.arrowsPerEndCount;
    }
    if (this.successZone !== undefined) {
      settings.successZone = this.successZone;
    }
    this.newSettings.emit(settings);
  }
}
