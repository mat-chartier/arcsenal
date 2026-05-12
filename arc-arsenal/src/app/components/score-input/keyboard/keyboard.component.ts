import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlasonType, getScoreClass as scoreClassFn } from '../../../utils/score-utils';

@Component({
  selector: 'app-score-keyboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss'
})
export class ScoreKeyboardComponent {
  @Input() blasonType: BlasonType = 'anglais';
  @Output() scoreSelected = new EventEmitter<number | 'X' | 'M'>();

  get values(): (number | 'X' | 'M')[] {
    if (this.blasonType === 'campagne') return [6, 5, 4, 3, 2, 1, 'M'];
    return ['X', 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 'M'];
  }

  get columnClass(): string {
    return this.blasonType === 'campagne' ? 'is-one-third' : 'is-one-quarter';
  }

  getScoreClass = (v: number | 'X' | 'M') => scoreClassFn(v, this.blasonType);

  selectScore(value: number | 'X' | 'M') {
    this.scoreSelected.emit(value);
  }
}
