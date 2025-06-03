import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreKeyboardComponent } from './keyboard.component';

describe('ScoreKeyboardComponent', () => {
  let component: ScoreKeyboardComponent;
  let fixture: ComponentFixture<ScoreKeyboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreKeyboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
