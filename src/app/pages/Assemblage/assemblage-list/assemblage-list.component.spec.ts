import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblageListComponent } from './assemblage-list.component';

describe('AssemblageListComponent', () => {
  let component: AssemblageListComponent;
  let fixture: ComponentFixture<AssemblageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssemblageListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssemblageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
