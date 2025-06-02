import { NgModule, ApplicationConfig } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { RouterModule, provideRouter } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Angular Material Modules
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // For MatSnackBar

// Routing
import { AppRoutingModule } from './app-routing.module';

// Root Component
import { AppComponent } from './app.component';

// Pages
import { LoginComponent } from './pages/login/login.component';
import { ProfileDashboardComponent } from './layouts/rh-layout/profile-dashboard/profile-dashboard.component';
import { EmployeeListComponent } from './pages/employee/employee-list/employee-list.component';
import { EmployeeAddComponent } from './pages/employee/employee-add/employee-add.component';
import { EmployeeEditComponent } from './pages/employee/employee-edit/employee-edit.component';
import { EmployeeDetailsComponent } from './pages/employee/employee-details/employee-details.component';
import { EmployeeDeleteComponent } from './pages/employee/employee-delete/employee-delete.component';
import { ProductComponent } from './pages/products/product/product.component';
import { SerializedComponent } from './pages/products/serialized/serialized.component';
import { NonSerializedComponent } from './pages/products/non-serialized/non-serialized.component';
import { SynoptiqueComponent } from './pages/products/synoptique/synoptique.component';
import { ProductListComponent } from './pages/products/product-list/product-list.component';
import { ProductDeleteComponent } from './pages/products/product-delete/product-delete.component';
import { JustificationComponent } from './pages/products/justification/justification.component';
import { ReferenceFormComponent } from './pages/products/reference-form/reference-form.component';
import { GalliaListComponent } from './pages/Gallia/gallia-list/gallia-list.component';
import { GalliaCreateComponent } from './pages/Gallia/gallia-create/gallia-create.component';
import { PreviewDialogComponent } from './pages/Gallia/preview-dialog/preview-dialog.component';
import { ProfileComponent } from './pages/employee/profile/profile.component';

// Layouts
import { HeaderComponent } from './layouts/rh-layout/header/header.component';
import { SidebarComponent } from './layouts/rh-layout/sidebar/sidebar.component';
import { FooterComponent } from './layouts/rh-layout/footer/footer.component';
import { RhLayoutComponent } from './layouts/rh-layout/rh-layout/rh-layout.component';
import { PrepDashboardComponent } from './layouts/prep-layout/prep-dashboard/prep-dashboard.component';
import { PrepLayoutComponent } from './layouts/prep-layout/prep-layout/prep-layout.component';
import { PrepSidebarComponent } from './layouts/prep-layout/prep-sidebar/prep-sidebar.component';
import { AdminDashboardComponent } from './layouts/admin-layout/admin-dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout/admin-layout.component';
import { AdminSidebarComponent } from './layouts/admin-layout/admin-sidebar/admin-sidebar.component';
import { TracaDashboardComponent } from './layouts/traca-layout/traca-dashboard/traca-dashboard.component';
import { TracaLayoutComponent } from './layouts/traca-layout/traca-layout/traca-layout.component';
import { TracaSidebarComponent } from './layouts/traca-layout/traca-sidebar/traca-sidebar.component';
import { LabelDetailDialogComponent } from './pages/Gallia/label-detail-dialog/label-detail-dialog.component';
import { FlanDecoupeCreateComponent } from './pages/Flan/flan-decoupe-create/flan-decoupe-create.component';
import { FlanDecoupeListComponent } from './pages/Flan/flan-decoupe-list/flan-decoupe-list.component';
import { PrepHeaderComponent } from './layouts/prep-layout/prep-header/prep-header.component';
import { AssemblageListComponent } from './pages/Assemblage/assemblage-list/assemblage-list.component';
import { AssemblageFormComponent } from './pages/Assemblage/assemblage-form/assemblage-form.component';
import { AdminHeaderComponent } from './layouts/admin-layout/admin-header/admin-header.component';

// Services
import { EmployeeService } from './Services/employee.service';

// External Modules
import { NgxBarcode6Module } from 'ngx-barcode6';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProductJustificationDialogComponent } from './pages/products/product-justification-dialog/product-justification-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileDashboardComponent,
    EmployeeListComponent,
    EmployeeAddComponent,
    EmployeeEditComponent,
    EmployeeDetailsComponent,
    EmployeeDeleteComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    ProductComponent,
    SerializedComponent,
    NonSerializedComponent,
    SynoptiqueComponent,
    ProductListComponent,
    ProductDeleteComponent,
    JustificationComponent,
    ReferenceFormComponent,
    GalliaListComponent,
    GalliaCreateComponent,
    PreviewDialogComponent,
    ProfileComponent,
    RhLayoutComponent,
    PrepDashboardComponent,
    PrepLayoutComponent,
    PrepSidebarComponent,
    AdminDashboardComponent,
    AdminLayoutComponent,
    AdminSidebarComponent,
    TracaDashboardComponent,
    TracaLayoutComponent,
    TracaSidebarComponent,
    LabelDetailDialogComponent,
    FlanDecoupeCreateComponent,
    FlanDecoupeListComponent,
    PrepHeaderComponent,
    AssemblageListComponent,
    AssemblageFormComponent,
    AdminHeaderComponent,
    ProductJustificationDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxBarcode6Module,
    DragDropModule,
    RouterModule,
    NgbModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTableModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule, // Added for mat-form-field
    MatInputModule,     // Added for mat-input
    MatSelectModule,    // Added for mat-select, mat-option
    MatSnackBarModule   // Added for MatSnackBar
  ],
  providers: [EmployeeService],
  bootstrap: [AppComponent]
})
export class AppModule {}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]), // Populate with actual route config
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    )
  ]
};