import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlanDecoupeListComponent } from './flan-decoupe-list.component';

describe('FlanDecoupeListComponent', () => {
  let component: FlanDecoupeListComponent;
  let fixture: ComponentFixture<FlanDecoupeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlanDecoupeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlanDecoupeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
