import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TirCompteDoubleComponent } from './tir-compte-double.component';

describe('TirCompteDoubleComponent', () => {
  let component: TirCompteDoubleComponent;
  let fixture: ComponentFixture<TirCompteDoubleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TirCompteDoubleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TirCompteDoubleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
