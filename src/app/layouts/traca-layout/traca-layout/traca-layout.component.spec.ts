import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracaLayoutComponent } from './traca-layout.component';

describe('TracaLayoutComponent', () => {
  let component: TracaLayoutComponent;
  let fixture: ComponentFixture<TracaLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TracaLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TracaLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
