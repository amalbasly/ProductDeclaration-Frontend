import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepLayoutComponent } from './prep-layout.component';

describe('PrepLayoutComponent', () => {
  let component: PrepLayoutComponent;
  let fixture: ComponentFixture<PrepLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrepLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrepLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
