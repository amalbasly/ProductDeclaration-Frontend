import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepSidebarComponent } from './prep-sidebar.component';

describe('PrepSidebarComponent', () => {
  let component: PrepSidebarComponent;
  let fixture: ComponentFixture<PrepSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrepSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrepSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
