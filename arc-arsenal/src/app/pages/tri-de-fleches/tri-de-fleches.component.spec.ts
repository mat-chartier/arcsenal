import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriDeFlechesComponent } from './tri-de-fleches.component';

describe('TriDeFlechesComponent', () => {
  let component: TriDeFlechesComponent;
  let fixture: ComponentFixture<TriDeFlechesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriDeFlechesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TriDeFlechesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
