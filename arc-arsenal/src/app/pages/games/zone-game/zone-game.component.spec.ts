import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneGameComponent } from './zone-game.component';

describe('ZoneGameComponent', () => {
  let component: ZoneGameComponent;
  let fixture: ComponentFixture<ZoneGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoneGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
