import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleCountedShotGameComponent } from './simple-counted-shot.component';

describe('SimpleCountedShotComponent', () => {
  let component: SimpleCountedShotGameComponent;
  let fixture: ComponentFixture<SimpleCountedShotGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleCountedShotGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleCountedShotGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
