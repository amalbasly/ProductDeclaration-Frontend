import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynoptiqueComponent } from './synoptique.component';

describe('SynoptiqueComponent', () => {
  let component: SynoptiqueComponent;
  let fixture: ComponentFixture<SynoptiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SynoptiqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SynoptiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
