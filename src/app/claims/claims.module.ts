import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { ClaimsListingComponent } from './claims-listing/claims-listing.component';
import { ClaimsSearchComponent } from './claims-search/claims-search.component';
import { ClaimsTagComponent } from './claims-tag/claims-tag.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    ClaimsListingComponent,
    ClaimsSearchComponent,
    ClaimsTagComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AngularMyDatePickerModule,
    SharedModule
  ],
  providers:[DatePipe],
})
export class ClaimsModule { }
