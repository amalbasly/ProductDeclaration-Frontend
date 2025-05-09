import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalliaUpdateComponent } from './gallia-update.component';

describe('GalliaUpdateComponent', () => {
  let component: GalliaUpdateComponent;
  let fixture: ComponentFixture<GalliaUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GalliaUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalliaUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
