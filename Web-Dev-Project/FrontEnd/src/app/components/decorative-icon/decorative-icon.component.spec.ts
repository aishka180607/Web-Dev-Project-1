import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecorativeIconComponent } from './decorative-icon.component';

describe('DecorativeIconComponent', () => {
  let component: DecorativeIconComponent;
  let fixture: ComponentFixture<DecorativeIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecorativeIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecorativeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
