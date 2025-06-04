import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveTargetFaceComponent } from './target-face.component';

describe('InteractiveTargetFaceComponent', () => {
  let component: InteractiveTargetFaceComponent;
  let fixture: ComponentFixture<InteractiveTargetFaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractiveTargetFaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractiveTargetFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
