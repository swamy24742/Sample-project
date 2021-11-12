import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    UserListComponent,
    ManageUserComponent
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
  entryComponents:[ManageUserComponent]
})
export class UserProfileModule { }
