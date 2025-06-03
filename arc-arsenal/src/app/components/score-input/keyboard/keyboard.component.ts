import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  getScoreClass(value: number | 'X' | 'M'): string {
    if (value === 'X' || value === 10 || value === 9) return 'yellow';
    if (value === 8 || value === 7) return 'red';
    if (value === 6 || value === 5) return 'blue';
    if (value === 4 || value === 3) return 'black';
    if (value === 2 || value === 1) return 'white';
    if (value === 'M') return 'grey';
    return '';
  }
}
