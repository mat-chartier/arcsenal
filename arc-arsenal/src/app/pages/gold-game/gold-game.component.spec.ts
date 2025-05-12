import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldGameComponent } from './gold-game.component';

describe('GoldGameComponent', () => {
  let component: GoldGameComponent;
  let fixture: ComponentFixture<GoldGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoldGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
