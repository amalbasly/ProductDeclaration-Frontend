import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileDashboardComponent } from './layouts/rh-layout/profile-dashboard/profile-dashboard.component';
import { EmployeeListComponent } from './pages/employee/employee-list/employee-list.component';
import { EmployeeAddComponent } from './pages/employee/employee-add/employee-add.component';
import { EmployeeEditComponent } from './pages/employee/employee-edit/employee-edit.component';
import { EmployeeDetailsComponent } from './pages/employee/employee-details/employee-details.component';
import { EmployeeDeleteComponent } from './pages/employee/employee-delete/employee-delete.component';
import { EmployeeService } from './Services/employee.service';
import { HeaderComponent } from './layouts/rh-layout/header/header.component';
import { SidebarComponent } from './layouts/rh-layout/sidebar/sidebar.component';
import { FooterComponent } from './layouts/rh-layout/footer/footer.component';
import { ProductComponent } from './pages/products/product/product.component';
import { PrepDashboardComponent } from './layouts/prep-layout/prep-dashboard/prep-dashboard.component';
import { RhLayoutComponent } from './layouts/rh-layout/rh-layout/rh-layout.component';
import { PrepLayoutComponent } from './layouts/prep-layout/prep-layout/prep-layout.component';
import { PrepSidebarComponent } from './layouts/prep-layout/prep-sidebar/prep-sidebar.component';
import { SerializedComponent } from './pages/products/serialized/serialized.component';
import { NonSerializedComponent } from './pages/products/non-serialized/non-serialized.component';
import { SynoptiqueComponent } from './pages/products/synoptique/synoptique.component';
import { ProductListComponent } from './pages/products/product-list/product-list.component';
import { AdminDashboardComponent } from './layouts/admin-layout/admin-dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout/admin-layout.component';
import { AdminSidebarComponent } from './layouts/admin-layout/admin-sidebar/admin-sidebar.component';
import { TracaDashboardComponent } from './layouts/traca-layout/traca-dashboard/traca-dashboard.component';
import { TracaLayoutComponent } from './layouts/traca-layout/traca-layout/traca-layout.component';
import { TracaSidebarComponent } from './layouts/traca-layout/traca-sidebar/traca-sidebar.component';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ApplicationConfig } from '@angular/core';
import { ProductDeleteComponent } from './pages/products/product-delete/product-delete.component';
import { JustificationComponent } from './pages/products/justification/justification.component';

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
    PrepDashboardComponent,
    RhLayoutComponent,
    PrepLayoutComponent,
    PrepSidebarComponent,
    SerializedComponent,
    NonSerializedComponent,
    SynoptiqueComponent,
    ProductListComponent,
    AdminDashboardComponent,
    AdminLayoutComponent,
    AdminSidebarComponent,
    TracaDashboardComponent,
    TracaLayoutComponent,
    TracaSidebarComponent,
    ProductDeleteComponent,
    JustificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [EmployeeService , ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    provideHttpClient(
      withFetch(),             // <--- important for your NG02801 warning
      withInterceptorsFromDi()
    )
  ]
};