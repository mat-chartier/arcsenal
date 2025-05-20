import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlasonInteractifComponent } from './blason-interactif.component';

describe('BlasonInteractifComponent', () => {
  let component: BlasonInteractifComponent;
  let fixture: ComponentFixture<BlasonInteractifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlasonInteractifComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlasonInteractifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
