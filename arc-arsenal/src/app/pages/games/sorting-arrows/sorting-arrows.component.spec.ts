import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortingArrowsGameComponent } from './sorting-arrows.component';

describe('SortingArrowsGameComponent', () => {
  let component: SortingArrowsGameComponent;
  let fixture: ComponentFixture<SortingArrowsGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortingArrowsGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SortingArrowsGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
