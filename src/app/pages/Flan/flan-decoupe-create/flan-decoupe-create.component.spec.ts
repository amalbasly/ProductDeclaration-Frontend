import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlanDecoupeCreateComponent } from './flan-decoupe-create.component';

describe('FlanDecoupeCreateComponent', () => {
  let component: FlanDecoupeCreateComponent;
  let fixture: ComponentFixture<FlanDecoupeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlanDecoupeCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlanDecoupeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
