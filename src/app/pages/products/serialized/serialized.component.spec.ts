import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerializedComponent } from './serialized.component';

describe('SerializedComponent', () => {
  let component: SerializedComponent;
  let fixture: ComponentFixture<SerializedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SerializedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerializedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
