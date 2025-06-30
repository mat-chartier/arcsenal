import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigTenGameComponent } from './big-ten.component';

describe('BigTenGameComponent', () => {
  let component: BigTenGameComponent;
  let fixture: ComponentFixture<BigTenGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BigTenGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BigTenGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
