import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblageFormComponent } from './assemblage-form.component';

describe('AssemblageFormComponent', () => {
  let component: AssemblageFormComponent;
  let fixture: ComponentFixture<AssemblageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssemblageFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssemblageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
