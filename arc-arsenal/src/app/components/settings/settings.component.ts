import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-game-settings',
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  @Input() arrowsPerEndShotCount?: number; // Default value, can be overridden by input
  @Input() arrowsPerEndCount?: number; // Default value, can be overridden by input
  @Input() endsCount?: number; // Default value, can be overridden by input
  @Input() minimumArrowsPerEnd: number = 3; // Default value, can be overridden by input
  @Input() successZone?: number; // Default value, can be overridden by input
  @Input() referenceScore?: number; // Default value, can be overridden by input

  @Output() newSettings = new EventEmitter<{ arrowsPerEndShotCount?: number, endsCount?: number, arrowsPerEndCount?: number, successZone?: number, referenceScore?: number } | null>();

  incrementArrowsShotCount() {
    if (this.arrowsPerEndShotCount) {
      this.arrowsPerEndShotCount++;
    }
  }

  decrementArrowsShotCount() {
    if (this.arrowsPerEndShotCount && this.arrowsPerEndShotCount > this.minimumArrowsPerEnd) {
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
  incrementReferenceScore() {
    if (this.referenceScore) {
      this.referenceScore++;
    }
  }
  decrementReferenceScore() {
    if (this.referenceScore && this.referenceScore > 0) {
      this.referenceScore--;
    }
  }

  saveSettings() {
    let settings: { arrowsPerEndShotCount?: number, endsCount?: number, arrowsPerEndCount?: number, successZone?: number, referenceScore?: number } = {
    };
    if (this.arrowsPerEndShotCount) {
      settings.arrowsPerEndShotCount = this.arrowsPerEndShotCount;
    }
    if (this.endsCount) {
      settings.endsCount = this.endsCount
    }
    if (this.arrowsPerEndCount !== undefined) {
      settings.arrowsPerEndCount = this.arrowsPerEndCount;
    }
    if (this.successZone !== undefined) {
      settings.successZone = this.successZone;
    }
    if (this.referenceScore !== undefined) {
      settings.referenceScore = this.referenceScore;
    }
    this.newSettings.emit(settings);
  }
}
