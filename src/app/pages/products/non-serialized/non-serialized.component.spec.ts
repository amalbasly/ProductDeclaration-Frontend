import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonSerializedComponent } from './non-serialized.component';

describe('NonSerializedComponent', () => {
  let component: NonSerializedComponent;
  let fixture: ComponentFixture<NonSerializedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NonSerializedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonSerializedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
