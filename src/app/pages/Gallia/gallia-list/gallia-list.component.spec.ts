import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalliaListComponent } from './gallia-list.component';

describe('GalliaListComponent', () => {
  let component: GalliaListComponent;
  let fixture: ComponentFixture<GalliaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GalliaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalliaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
