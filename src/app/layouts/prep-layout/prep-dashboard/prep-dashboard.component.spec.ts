import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepDashboardComponent } from './prep-dashboard.component';

describe('PrepDashboardComponent', () => {
  let component: PrepDashboardComponent;
  let fixture: ComponentFixture<PrepDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrepDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrepDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
