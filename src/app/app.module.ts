import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_CONFIG } from './app.config';
import { enums } from './enumerations/enum';
import {AppConstants} from './enumerations/app-constants';
import {environment} from '../environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from './shared/shared.module';
import { TreatyModule } from './treaty/treaty.module';
import { ClaimsModule } from './claims/claims.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { ServiceInterceptor } from './helpers/interceptor/service.interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OauthRedirectComponent } from './oauth-redirect/oauth-redirect.component';
import { GenericErrorComponent } from './generic-error/generic-error.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    OauthRedirectComponent,
    GenericErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    SharedModule,
    TreatyModule,
    ClaimsModule,
    UserProfileModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServiceInterceptor,
      multi: true
    },
    { provide: APP_CONFIG,  useValue: {
      appCredentials: environment.appCredentials,
      appConstants:AppConstants.labels,
      enums:enums,
    }}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
