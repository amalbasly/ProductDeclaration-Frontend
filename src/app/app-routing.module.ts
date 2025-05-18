import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Public
import { LoginComponent } from './pages/login/login.component';

// RH Layout & Pages
import { RhLayoutComponent } from './layouts/rh-layout/rh-layout/rh-layout.component';
import { PrepLayoutComponent } from './layouts/prep-layout/prep-layout/prep-layout.component';
import { ProfileDashboardComponent } from './layouts/rh-layout/profile-dashboard/profile-dashboard.component';
import { PrepDashboardComponent } from './layouts/prep-layout/prep-dashboard/prep-dashboard.component';


// Admin Layout & Pages
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './layouts/admin-layout/admin-dashboard/admin-dashboard.component';

// Shared Employee Pages
import { EmployeeListComponent } from './pages/employee/employee-list/employee-list.component';
import { EmployeeAddComponent } from './pages/employee/employee-add/employee-add.component';
import { EmployeeEditComponent } from './pages/employee/employee-edit/employee-edit.component';
import { EmployeeDetailsComponent } from './pages/employee/employee-details/employee-details.component';
import { EmployeeDeleteComponent } from './pages/employee/employee-delete/employee-delete.component';
import { ProfileComponent } from './pages/employee/profile/profile.component';


// Other Pages
import { ProductComponent } from './pages/products/product/product.component';
import { SerializedComponent } from './pages/products/serialized/serialized.component';
import { NonSerializedComponent } from './pages/products/non-serialized/non-serialized.component';
import { SynoptiqueComponent } from './pages/products/synoptique/synoptique.component';
import { ProductListComponent } from './pages/products/product-list/product-list.component';
import { ProductDeleteComponent } from './pages/products/product-delete/product-delete.component';
import { JustificationComponent } from './pages/products/justification/justification.component';
import { GalliaListComponent } from './pages/Gallia/gallia-list/gallia-list.component';
import { GalliaCreateComponent } from './pages/Gallia/gallia-create/gallia-create.component';
import { ReferenceFormComponent } from './pages/products/reference-form/reference-form.component';
import { FlanDecoupeCreateComponent } from './pages/Flan/flan-decoupe-create/flan-decoupe-create.component';
import { FlanDecoupeListComponent } from './pages/Flan/flan-decoupe-list/flan-decoupe-list.component';






const routes: Routes = [
  // Public route
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // RH Layout with nested routes
  {
    path: 'rh',
    component: RhLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ProfileDashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { 
        path: 'employees', 
        children: [
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list', component: EmployeeListComponent },
          { path: 'add', component: EmployeeAddComponent },
          { path: 'edit/:mat', component: EmployeeEditComponent },
          { path: 'details/:mat', component: EmployeeDetailsComponent }
        ]
      }
    ]
  },

  {
  path: 'prep',
    component: PrepLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: PrepDashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'list', component: ProductListComponent },
      { 
      path: 'gallia',
      component: GalliaListComponent,
      data: { labelType: 'Gallia' }
    },
    { 
      path: 'etiquette',
      component: GalliaListComponent,
      data: { labelType: 'Etiquette' }
    },
    { 
      path: 'createG', 
      component: GalliaCreateComponent,
      data: { labelType: 'Gallia' }
    },
    { 
      path: 'create-etiquette', 
      component: GalliaCreateComponent,
      data: { labelType: 'Etiquette' }
    },
      {path:'flanC', component: FlanDecoupeCreateComponent},
      {path : 'flanList', component : FlanDecoupeListComponent},

      { 
        path: 'products/create/serialized', 
        component: SerializedComponent,
        data: { isSerialized: true },
        children: [
          { path: '', redirectTo: 'product', pathMatch: 'full' },
          { path: 'product', component: ProductComponent },
          { path: 'synoptique/:ptNum', component: SynoptiqueComponent },
          { path: 'justification/:ptNum', component: JustificationComponent }
        ]
      },
      { 
        path: 'products/create/non-serialized',
        component: NonSerializedComponent,
        data: { isSerialized: false },
        children: [
          { path: '', redirectTo: 'product', pathMatch: 'full' },
          { path: 'product', component: ProductComponent },
          { path: ':productCode/reference', component: ReferenceFormComponent },
          { path: 'justification/:ptNum', component: JustificationComponent }
        ]
      }
    ]
  },
  
  // Admin Layout with shared pages
  /*{
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'employees', children: [
        { path: 'list', component: EmployeeListComponent },
        { path: 'add', component: EmployeeAddComponent },
        { path: 'edit/:mat', component: EmployeeEditComponent },
        { path: 'details/:mat', component: EmployeeDetailsComponent },
        { path: 'delete', component: EmployeeDeleteComponent },
      ]},
      {path : 'list', component : ProductListComponent},

      { 
        path: 'products/create/serialized', 
        component: SerializedComponent,
        data: { isSerialized: true }, // Add route data
        children: [
          { path: '', redirectTo: 'product', pathMatch: 'full' },
          { path: 'product', component: ProductComponent },
          { path: 'deleteP', component:ProductDeleteComponent },
          { path: 'synoptique/:ptNum', component: SynoptiqueComponent },
          {path :'justification/:ptNum', component: JustificationComponent}
        ]
      },
      { 
        path: 'products/create/non-serialized',
        component: NonSerializedComponent,
        data: { isSerialized: false }, // Add route data
        children: [
          { path: '', redirectTo: 'product', pathMatch: 'full' },
          { path: 'product', component: ProductComponent }
        ]
      }
    ]
  },*/

  // Fallback
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
