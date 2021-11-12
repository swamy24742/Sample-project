import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { ListTreatyComponent } from './list-treaty/list-treaty.component';
import { ManageTreatyComponent } from './manage-treaty/manage-treaty.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    ListTreatyComponent,
    ManageTreatyComponent
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
  entryComponents:[ManageTreatyComponent]
})
export class TreatyModule { }
