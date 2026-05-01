import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticRefEndScoreComponent } from './static-ref-end-score.component';

describe('StaticRefEndScoreComponent', () => {
  let component: StaticRefEndScoreComponent;
  let fixture: ComponentFixture<StaticRefEndScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaticRefEndScoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaticRefEndScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
