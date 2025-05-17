import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlanDecoupeDetailsComponent } from './flan-decoupe-details.component';

describe('FlanDecoupeDetailsComponent', () => {
  let component: FlanDecoupeDetailsComponent;
  let fixture: ComponentFixture<FlanDecoupeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlanDecoupeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlanDecoupeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
