import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelDetailDialogComponent } from './label-detail-dialog.component';

describe('LabelDetailDialogComponent', () => {
  let component: LabelDetailDialogComponent;
  let fixture: ComponentFixture<LabelDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabelDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
