import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracaHeaderComponent } from './traca-header.component';

describe('TracaHeaderComponent', () => {
  let component: TracaHeaderComponent;
  let fixture: ComponentFixture<TracaHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TracaHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TracaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
