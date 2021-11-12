import { Injectable, Inject } from '@angular/core';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data/data.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { StatusModalComponent } from '../../components/status-modal/status-modal.component';
import { UserCategory } from 'src/app/user-profile/models/user-category';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  statusModalRef: any = '';
  agreementList: any = [];
  systemRoles:UserCategory[] = [];

  constructor(private dataService: DataService, private modalService: NgbModal) { }

  getUserCategories():Array<UserCategory>{
    return this.systemRoles;
  }

  setSystemRoles(systemRoles:any){
    this.systemRoles = systemRoles;
  }

  getAgreementLists(): any {
    return this.agreementList;
  }

  setAgreementLists(data: any): any {
    this.agreementList = data;
  }

  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.log("error in api calls");
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }



  /** Log a HeroService message with the MessageService */
  public log(message: string) {
    console.log(message);
  }

  compareDate(fromDate: any, toDate: any) {
    var date1 = this.formatDateLocale(fromDate);
    var date2 = this.formatDateLocale(toDate);
    if (date1 > date2) {
      return false;
    } else if (date1 < date2) {
      return true;
    } else {
      return true;
    }
  }

  initiateConfirmModal(modalConfig: any) {
    this.statusModalRef = this.modalService.open(ConfirmModalComponent,
      {
        scrollable: true,
        windowClass: 'cb-confirm-modal',
        centered: true,
        backdrop: 'static'
      });

    this.statusModalRef.componentInstance.modalConfig = modalConfig;
  }

  initiateStatusModal(modalConfig: any) {
    this.statusModalRef = this.modalService.open(StatusModalComponent,
      {
        scrollable: true,
        windowClass: 'cb-status-modal',
        centered: true,
        backdrop: 'static'
      });

    this.statusModalRef.componentInstance.modalConfig = modalConfig;
    this.handleModalTimeOut();
  }

  handleModalTimeOut() {
    setTimeout(() => {
      this.statusModalRef.close();
    }, 3500);
  }

  formatDateLocale(dateObj: any) {
    return new Date(dateObj.month + "/" + dateObj.day + "/" + dateObj.year);
  }

  formatDefaultDateFormat(dateObj: any) {
    return this.formatRequestDateFormat(new Date(dateObj.month + "/" + dateObj.day + "/" + dateObj.year));
  }

  formatRequestDateFormat(dateObj: any) {
    return this.formatDate(dateObj)
  }

  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  showLoader() {
    this.dataService.sendMessage(true, 'handleLoader');
  }

  hideLoader() {
    this.dataService.sendMessage(false, 'handleLoader');
  }

  closeConfirmModal() {
    this.statusModalRef.close();
  }

  getArrayIndex(arrayData: any, key: string, value: string) {
    console.log('getArrayIndex', key, value);
    return arrayData.findIndex((x: any) => x[key].toString() === value.toString());
  }

  validateAPIResponse(res: any) {
    if (res.Status === 200) {
      return true
    } else {
      return false;
    }
  }

}
