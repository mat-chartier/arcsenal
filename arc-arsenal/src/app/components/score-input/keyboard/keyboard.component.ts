import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getScoreClass } from '../../../utils/score-utils';

@Component({
  selector: 'app-score-keyboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss'
})
export class ScoreKeyboardComponent {
  @Output() scoreSelected = new EventEmitter<number | 'X' | 'M'>();
  values: (number | 'X' | 'M')[] = [
    'X',
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1,
    'M',
  ];

  selectScore(value: number | 'X' | 'M') {
    this.scoreSelected.emit(value);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }

  getScoreClass = getScoreClass;
}
