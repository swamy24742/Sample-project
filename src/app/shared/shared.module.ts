import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { StatusModalComponent } from './components/status-modal/status-modal.component';
import { HeaderComponent } from './components/header/header.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { CommonService, DataService } from './services';
import { SearchComponent } from './components/search/search.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { CommonPipe } from './pipes/common.pipe';
import { FooterComponent } from './components/footer/footer.component';
import { SessionTimerComponent } from './components/session-timer/session-timer.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    ConfirmModalComponent,
    StatusModalComponent,
    HeaderComponent,
    PaginationComponent,
    BreadCrumbComponent,
    SearchComponent,
    CommonPipe,
    FooterComponent,
    SessionTimerComponent,
    LoaderComponent
  ],
  providers:[CommonService, DataService],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    AngularMyDatePickerModule
  ],
  exports: [HeaderComponent, FooterComponent, PaginationComponent, BreadCrumbComponent, SearchComponent, SessionTimerComponent, LoaderComponent, CommonPipe],
  entryComponents:[ConfirmModalComponent, StatusModalComponent]
})
export class SharedModule { }
