import { Component, OnInit } from '@angular/core';
import { AssemblageService, CreateAssemblageDto, UpdateAssemblageDto, AssemblageDto } from '../../../Services/assemblage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { GalliaService } from '../../../Services/gallia.service';
import { FlanDecoupeService } from '../../../Services/flan-decoupe.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-assemblage-form',
  standalone: false,
  templateUrl: './assemblage-form.component.html',
  styleUrls: ['./assemblage-form.component.scss']
})
export class AssemblageFormComponent implements OnInit {
  isEditMode = false;
  assemblageId?: number;
  form: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  productOptions: string[] = [];
  labelOptions: string[] = [];
  secondaryProductCount: number = 0;
  
  constructor(
    private fb: FormBuilder,
    private assemblageService: AssemblageService,
    private flanDecoupeService: FlanDecoupeService,
    private galliaService: GalliaService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.form = this.fb.group({
      nomAssemblage: ['', Validators.required],
      mainProduitPtNum: ['', Validators.required],
      labelName: ['', Validators.required],
      secondaryProducts: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadDropdownOptions();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.assemblageId = +params['id'];
        this.loadAssemblage(this.assemblageId);
      }
    });
  }

  loadDropdownOptions(): void {
    this.flanDecoupeService.getUncutProducts().subscribe({
      next: (products: string[]) => {
        this.productOptions = products.filter(p => p && p.trim() !== '');
        if (this.productOptions.length > 0 && !this.isEditMode) {
          this.form.patchValue({
            mainProduitPtNum: this.productOptions[0]
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load product options', err);
        this.errorMessage = 'Failed to load product options';
      }
    });

    this.galliaService.getLabelNames().subscribe({
      next: (names: string[]) => {
        this.labelOptions = names;
        if (this.labelOptions.length > 0 && !this.isEditMode) {
          this.form.patchValue({
            labelName: this.labelOptions[0]
          });
        } else if (this.labelOptions.length === 0) {
          this.errorMessage = this.errorMessage ? 
            `${this.errorMessage}; No label names available` : 
            'No label names available';
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to fetch label names', err);
        this.errorMessage = this.errorMessage ?
          `${this.errorMessage}; Failed to load label names` :
          'Failed to load label names';
      }
    });
  }

  get secondaryProducts(): FormArray {
    return this.form.get('secondaryProducts') as FormArray;
  }

  createSecondaryProduct(): FormGroup {
    return this.fb.group({
      ptNum: ['', Validators.required]
    });
  }

  setSecondaryProductCount(count: number): void {
    const currentCount = this.secondaryProducts.length;
    
    if (count > currentCount) {
      for (let i = currentCount; i < count; i++) {
        this.secondaryProducts.push(this.createSecondaryProduct());
        if (this.productOptions.length > 0) {
          this.secondaryProducts.at(i).patchValue({
            ptNum: this.productOptions[0]
          });
        }
      }
    } else if (count < currentCount) {
      for (let i = currentCount; i > count; i--) {
        this.secondaryProducts.removeAt(i - 1);
      }
    }
    
    this.secondaryProductCount = count;
  }

  loadAssemblage(id: number): void {
    this.loading = true;
    this.errorMessage = null;
    this.assemblageService.getAssemblageById(id).subscribe({
      next: (assemblage: AssemblageDto) => {
        this.form.patchValue({
          nomAssemblage: assemblage.nomAssemblage,
          mainProduitPtNum: assemblage.mainProduitPtNum,
          labelName: assemblage.galliaName
        });
        
        this.setSecondaryProductCount(assemblage.secondaryProduits.length);
        assemblage.secondaryProduits.forEach((product, index) => {
          this.secondaryProducts.at(index).patchValue({
            ptNum: product.ptNum
          });
        });
        
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.errorMessage = 'Failed to load assemblage';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;
    const formValue = this.form.value;

    const dto: CreateAssemblageDto | UpdateAssemblageDto = {
      nomAssemblage: formValue.nomAssemblage,
      mainProduitPtNum: formValue.mainProduitPtNum,
      galliaName: formValue.labelName,
      secondaryProduitPtNums: formValue.secondaryProducts.map((p: { ptNum: string }) => p.ptNum)
    };

    if (this.isEditMode && this.assemblageId) {
      this.assemblageService.updateAssemblage(this.assemblageId, dto as UpdateAssemblageDto).subscribe({
        next: () => {
          this.handleSuccess();
        },
        error: (err: HttpErrorResponse) => {
          this.handleError(err, 'update');
        }
      });
    } else {
      this.assemblageService.createAssemblage(dto as CreateAssemblageDto).subscribe({
        next: (response: { assemblageId: number }) => {
          this.handleSuccess();
        },
        error: (err: HttpErrorResponse) => {
          this.handleError(err, 'create');
        }
      });
    }
  }

  private handleSuccess(): void {
    this.successMessage = `Assemblage ${this.isEditMode ? 'updated' : 'created'} successfully`;
    setTimeout(() => this.router.navigate(['/prep/assemblageL']), 2000);
  }

  private handleError(err: HttpErrorResponse, action: string): void {
    console.error(err);
    this.errorMessage = `Failed to ${action} assemblage`;
    this.loading = false;
  }

  clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }
}