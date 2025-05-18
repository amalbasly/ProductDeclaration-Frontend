import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepHeaderComponent } from './prep-header.component';

describe('PrepHeaderComponent', () => {
  let component: PrepHeaderComponent;
  let fixture: ComponentFixture<PrepHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrepHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrepHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
