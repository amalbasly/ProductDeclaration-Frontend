import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductJustificationDialogComponent } from './product-justification-dialog.component';

describe('ProductJustificationDialogComponent', () => {
  let component: ProductJustificationDialogComponent;
  let fixture: ComponentFixture<ProductJustificationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductJustificationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductJustificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
