import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ProfileDashboardComponent } from './pages/profile-dashboard/profile-dashboard.component';
import { EmployeeListComponent } from './pages/employee/employee-list/employee-list.component';
import { EmployeeAddComponent } from './pages/employee/employee-add/employee-add.component';
import { EmployeeDeleteComponent } from './pages/employee/employee-delete/employee-delete.component';
import { EmployeeDetailsComponent } from './pages/employee/employee-details/employee-details.component';
import { EmployeeEditComponent } from './pages/employee/employee-edit/employee-edit.component';
import { NavbarComponent } from './components/navbar/navbar.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {path : 'navbar', component : NavbarComponent},
  //{ path: 'employee/add', component: EmployeeAddComponent },
  { path: 'employee/delete', component: EmployeeDeleteComponent },
  { path: 'employee/list', component: EmployeeListComponent },
  { path: 'employee/edit/:matricule', component: EmployeeEditComponent },
  { path: 'employee/details/:matricule', component: EmployeeDetailsComponent },
  { path: 'profile-dashboard', component: ProfileDashboardComponent,
    children: [
      { path: 'employee', redirectTo: 'employee/list', pathMatch: 'full' },
      //{ path: 'employee/list', component: EmployeeListComponent },
      { path: 'employee/add', component: EmployeeAddComponent },
      //{ path: 'employee/edit/:matricule', component: EmployeeEditComponent },
      //{ path: 'employee/delete/:matricule', component: EmployeeDeleteComponent },
      { path: 'employee/details/:matricule', component: EmployeeDetailsComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }