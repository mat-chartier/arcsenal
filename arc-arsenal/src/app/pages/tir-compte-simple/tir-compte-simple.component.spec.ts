import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TirCompteSimpleComponent } from './tir-compte-simple.component';

describe('TirCompteSimpleComponent', () => {
  let component: TirCompteSimpleComponent;
  let fixture: ComponentFixture<TirCompteSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TirCompteSimpleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TirCompteSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
