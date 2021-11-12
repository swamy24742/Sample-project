import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../app/helpers/guard/auth.guard";
import { ListTreatyComponent } from "./treaty/list-treaty/list-treaty.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { OauthRedirectComponent } from "./oauth-redirect/oauth-redirect.component";
import { ClaimsListingComponent } from "./claims/claims-listing/claims-listing.component";
import { GenericErrorComponent } from "./generic-error/generic-error.component";
import { UserListComponent } from './user-profile/user-list/user-list.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,  canActivate: [AuthGuard], data : {page : 'dashboard'}
  },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data : {page : 'dashboard'}
  },
  {
    path: 'oauth-redirect', component: OauthRedirectComponent
  },
  {
    path: 'list-treaty', component: ListTreatyComponent, canActivate: [AuthGuard], data : {page : 'Reinsurance/Treaty Code Maintenance'}
  },
  {
    path: 'claims-tagging', component: ClaimsListingComponent, canActivate: [AuthGuard], data : {page : 'Claims Tagging'}
  },
  {
    path: 'user-list', component: UserListComponent, canActivate: [AuthGuard], data : {page : 'User Profile'}
  },
  {
    path: 'access-error', component: GenericErrorComponent, data : {page : 'Access Denied'}
  },
  {
    path: 'page-access-error', component: GenericErrorComponent, data : {page : 'Invalid Access'}
  },
  {
    path: 'generic-error', component: GenericErrorComponent, data : {page : 'Generic Error'}
  },
  {
    path: 'session-expired', component: GenericErrorComponent, data : {page : 'Session Expired'}
  },
  {
    path: 'logged-out', component: GenericErrorComponent, data : {page : 'Logged Out'}
  },
  {
    path: "**", redirectTo: "dashboard"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
