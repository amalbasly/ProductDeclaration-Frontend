import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalliaCreateComponent } from './gallia-create.component';

describe('GalliaCreateComponent', () => {
  let component: GalliaCreateComponent;
  let fixture: ComponentFixture<GalliaCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GalliaCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalliaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
