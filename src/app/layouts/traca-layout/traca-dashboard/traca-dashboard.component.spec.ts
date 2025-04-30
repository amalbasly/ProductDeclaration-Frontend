import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracaDashboardComponent } from './traca-dashboard.component';

describe('TracaDashboardComponent', () => {
  let component: TracaDashboardComponent;
  let fixture: ComponentFixture<TracaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TracaDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TracaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
