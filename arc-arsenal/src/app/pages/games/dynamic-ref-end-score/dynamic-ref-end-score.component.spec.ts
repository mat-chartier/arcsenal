import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicRefEndScoreComponent } from './dynamic-ref-end-score.component';

describe('DynamicRefEndScoreComponent', () => {
  let component: DynamicRefEndScoreComponent;
  let fixture: ComponentFixture<DynamicRefEndScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicRefEndScoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicRefEndScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
