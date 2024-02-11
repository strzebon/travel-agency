import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { ManagerGuard } from './guard/manager.guard';
import { AdminGuard } from './guard/admin.guard';

import { FormComponent } from './form/form.component';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TripListComponent } from './trip-list/trip-list.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';



const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'add' , component: FormComponent, canActivate: [ManagerGuard]},
  {path: 'trip-list', component: TripListComponent},
  {path: 'history', component: HistoryComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'admin-panel', component: AdminPanelComponent, canActivate: [AdminGuard]},
  {path: 'edit', component: FormComponent, canActivate: [ManagerGuard]},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }