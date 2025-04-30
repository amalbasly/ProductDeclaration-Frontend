import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracaSidebarComponent } from './traca-sidebar.component';

describe('TracaSidebarComponent', () => {
  let component: TracaSidebarComponent;
  let fixture: ComponentFixture<TracaSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TracaSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TracaSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
