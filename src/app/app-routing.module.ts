import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ProfileDashboardComponent } from './pages/profile-dashboard/profile-dashboard.component';
import { EmployeeListComponent } from './pages/employee/employee-list/employee-list.component';
import { EmployeeAddComponent } from './pages/employee/employee-add/employee-add.component';
import { EmployeeDeleteComponent } from './pages/employee/employee-delete/employee-delete.component';
import { EmployeeDetailsComponent } from './pages/employee/employee-details/employee-details.component';
import { EmployeeEditComponent } from './pages/employee/employee-edit/employee-edit.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ProductComponent } from './pages/products/product/product.component';
const routes: Routes = [
  // Public
  { path: '',              redirectTo: 'login',           pathMatch: 'full' },
  { path: 'login',         component: LoginComponent },

  // Dashboard (RH / Traca / Admin)
  {
    path: 'profile-dashboard',
    component: ProfileDashboardComponent,
    children: [
      // Default: go straight to list
      { path: '',redirectTo: 'employee/list',  pathMatch: 'full'},

      // Employee management
      { path: 'employee/list',component: EmployeeListComponent},
      { path: 'employee/add',component: EmployeeAddComponent},
      { path: 'employee/edit/:mat',component: EmployeeEditComponent},
      { path: 'employee/details/:mat',component: EmployeeDetailsComponent},
      { path: 'employee/delete',component: EmployeeDeleteComponent},
    ]
  },
  {path : 'sidebar',component:SidebarComponent},
  { path: 'product', component: ProductComponent},
  { path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }