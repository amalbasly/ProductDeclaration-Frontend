import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceFormComponent } from './reference-form.component';

describe('ReferenceFormComponent', () => {
  let component: ReferenceFormComponent;
  let fixture: ComponentFixture<ReferenceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
