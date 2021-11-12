import { Component, OnInit, PipeTransform, OnDestroy } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageTreatyComponent } from '../manage-treaty/manage-treaty.component';
import { CommonService, DataService, AuthService } from '../../shared/services';
import { TreatyService } from '../treaty.service';
import { Subscription } from 'rxjs';
import { DecimalPipe, DatePipe } from '@angular/common';


@Component({
  selector: 'app-list-treaty',
  templateUrl: './list-treaty.component.html',
  styleUrls: ['./list-treaty.component.scss'],
  providers: [ DecimalPipe, DatePipe]
})
export class ListTreatyComponent implements OnInit, OnDestroy {

  page = 1;
  pageSize = 15;
  collectionSize = 0;
  initialCollectionSize = 0;

  treatyMasterList: any = [];
  treatyList: any = [];
  pageOfDisplay: string = '';

  modalActions: Subscription;
  manageTreatyModalRef: any = '';
  searchQueryObj:any = {};

  dataLoaded: boolean =  false;
  currentPage:string = "Reinsurance Treaty Maintenance";
  hasValidPermission: boolean = false;
  searchParam = 'treaty';


  constructor(private modalService: NgbModal, private dataService: DataService, private commonService: CommonService, private pipe: DecimalPipe, private treatyService: TreatyService, private datePipe: DatePipe, private authService:AuthService) {
    this.modalActions = this.dataService.modalActions$.subscribe((data: any) =>{
      this.handleModalActions(data.message);
    });
  }

  ngOnInit(): void {
    this.getUserAccessDetails();
    this.getAgreementList();
    this.searchQueryObj = { ...this.searchQueryObj, PageNumber: this.page, PageSize: this.pageSize};
    this.getTreatyList(this.searchQueryObj);
  }

  getUserAccessDetails(){
    let accessDetails = this.authService.getUserData().accessDetails;
    if(accessDetails['Reinsurance/Treaty Code Maintenance'] === 'Edit'){
      this.hasValidPermission = true;
    }else{
      this.hasValidPermission = false;
    }
  }


  getAgreementList(){
    this.treatyService.getAgreementType()
      .subscribe(res => {
        if(this.commonService.validateAPIResponse(res)){
          this.commonService.setAgreementLists(res.Result);
        }else{
          this.commonService.setAgreementLists([]);
        }
      }, (err) => {
        //this.commonService.hideLoader();
      });
  }

  getTreatyList(query:any) {
    this.dataLoaded = false;
    this.treatyService.getTreaty(query)
      .subscribe(res => {
        let data = res;
        this.dataLoaded = true;
        if(this.commonService.validateAPIResponse(res)){
          let res = data.Result;
          this.treatyMasterList  = res.treatyDetails;
          this.collectionSize = res.totalCount;
          this.initialCollectionSize = res.totalCount;
        }else{
          this.treatyMasterList  = [];
          this.collectionSize = 0;
          this.initialCollectionSize = 0;
        }
        this.handleTreatyList();
      }, (err) => {
        this.dataLoaded = true;
        //this.commonService.hideLoader();
      });
  }

  handleTreatyList() {
    this.treatyList = this.treatyMasterList;
    this.displayPageOfLogic();
  }

  handleTreatyListSearch(data: any, isCleard:boolean) {
    if(!isCleard){
      this.page = 1;
    }
    this.collectionSize = data.length;
    this.treatyList = data
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    this.displayPageOfLogic();
  }

  displayPageOfLogic() {
    let initialCount;
    if (this.page == 1) {
      initialCount = 0;
    } else {
      initialCount = this.pageSize;
    }
    let start = ((this.page - 1) * this.pageSize) + 1;
    let end = (start + this.pageSize) > this.treatyList.length ? ((start - 1) + this.treatyList.length) : (start + this.pageSize);
    this.pageOfDisplay = 'Showing ' + '<b>' + start + '</b>' + ' to ' + '<b>' + end + '</b>' + ' out of ' + '<b>' + this.collectionSize + '</b>' + ' entries';
  }

  handlePagination(ev: any) {
    this.page = ev;
    this.searchQueryObj = { ...this.searchQueryObj, PageNumber: this.page, PageSize: this.pageSize};
    this.getTreatyList(this.searchQueryObj);
  }

  handleTreatyEdit(index: any) {
    this.handleManageTreaty(this.treatyList[index], { isEditMode: true, hasValues: true, isDuplicateError: false });
  }

  handleAddTreaty() {
    this.handleManageTreaty({}, { isEditMode: false, hasValues: false, isDuplicateError: false });
    // this.handleManageTreaty({
    //   riAgency: "sdsd",
    //   tradingPartner: "dfdfdfdf",
    //   treatyName: "test",
    //   agreementType: "7",
    //   borisId: 0,
    //   calculatedBy: "B",
    //   cededNo: "xcxc",
    //   effectiveDate: '',
    //   expirationDate: ''
    // }, { isEditMode: false, hasValues: true });
  }

  handleManageTreaty(data: any, treatyConfig: any) {
    this.manageTreatyModalRef = this.modalService.open(ManageTreatyComponent,
      {
        scrollable: true,
        windowClass: 'cb-manage-treaty',
        centered: true,
        backdrop: 'static'
      });

    this.manageTreatyModalRef.componentInstance.treatyData = data;
    this.manageTreatyModalRef.componentInstance.treatyConfig = treatyConfig;
  }

  handleModalActions(data: any){
    if(data.modalDetails.action === 'proceed'){
      this.handleConfirmProceedActions(data);
    }else if(data.modalDetails.action === 'cancel'){
      this.handleConfirmCancelActions(data);
    }else if(data.modalDetails.action === 'save'){
      this.manageTreatyModalRef.close();
      this.initiateConfirmModal(data.modalDetails);
    }else{
      this.manageTreatyModalRef.close();
    }
  }

  handleConfirmProceedActions(data:any){
    this.commonService.closeConfirmModal();
    switch(data.modalDetails.modalSubject){
      case "deleteTreaty":
        this.deleteTreaty(data.modalDetails.modalData);
        break;
      case "treatyModalActions":
        if(data.modalDetails.isEditMode){
          this.updateTreaty(data.modalDetails);
        }else{
          this.createTreaty(data.modalDetails);
        }
        break;
    }
  }


  handleConfirmCancelActions(data:any){
    this.commonService.closeConfirmModal();
    switch(data.modalDetails.modalSubject){
      case "deleteTreaty":
        //no action
        break;
      case "treatyModalActions":
        this.handleManageTreaty(data.modalDetails.modalData, { isEditMode: data.modalDetails.isEditMode, hasValues: true, isDuplicateError: false });
        break;
    }
  }

  initiateConfirmModal(modalDetails:any){
    this.commonService.initiateConfirmModal(modalDetails);
  }

  initiateStatusModal(configObj:any){
    this.commonService.initiateStatusModal(configObj);
  }

  createTreaty(data:any) {
    data.modalData.agreementType = parseInt(data.modalData.agreementType);
    this.treatyService.createTreaty(data.modalData).subscribe(res => {
      if(this.commonService.validateAPIResponse(res)){
        this.getTreatyList(this.searchQueryObj);
        this.initiateStatusModal({
          status: 'success',
          modalSubject: 'addTreaty'
        });
      }else{
        this.triggerErrorAlert('addTreaty');
      }
    }, (err) => {
      if(err.status === 409){
        this.handleManageTreaty(data.modalData, { isEditMode: data.isEditMode, hasValues: true, isDuplicateError: true });
      }else if(err.status !== 403){
        this.triggerErrorAlert('addTreaty');
      }
    })
  }

  updateTreaty(data:any) {
    data.modalData.agreementType = parseInt(data.modalData.agreementType);
    this.treatyService.updateTreaty(data.modalData).subscribe(res => {
      if(this.commonService.validateAPIResponse(res)){
        this.getTreatyList(this.searchQueryObj);
        this.initiateStatusModal({
          status: 'success',
          modalSubject: 'updateTreaty'
        });
      }else{
        this.triggerErrorAlert('updateTreaty');
      }
    }, (err) => {
      if(err.status === 409){
        this.handleManageTreaty(data.modalData, { isEditMode: data.isEditMode, hasValues: true, isDuplicateError: true });
      }else if(err.status !== 403){
        this.triggerErrorAlert('updateTreaty');
      }
    })
  }

  handleDuplicateTreaty(data:any){
    console.log(data)
  }

  triggerErrorAlert(modalSubject:string){
    this.initiateStatusModal({
      status: 'error',
      modalSubject: modalSubject
    });
  }

  triggerSearch(searchData: any){
    if(searchData.type === "soft"){
      let text = searchData.query;
      if (text == undefined || text == null || text == '') {
        this.collectionSize = this.initialCollectionSize;
        this.page = this.searchQueryObj.PageNumber;
        this.handleTreatyList();
      } else {
        const searchResult = this.search(text, this.pipe);
        this.handleTreatyListSearch(searchResult, false);
      }
    }else{
      this.page = 1;
      let queryObj = searchData.query;
      this.searchQueryObj = { ...queryObj, PageNumber: this.page, PageSize: this.pageSize };
      this.getTreatyList(this.searchQueryObj);
    }
  }

  search(text: string, pipe: PipeTransform): any {
    return this.treatyMasterList.filter((item: any) => {
    let tradingPartner = (item.tradingPartner !== null) ? item.tradingPartner : '';
      const term = text.toLowerCase();
      return item.treatyName.toLowerCase().includes(term)
        || item.riAgency.toLowerCase().includes(term)
        || tradingPartner.toLowerCase().includes(term)
        || item.cededNo.toLowerCase().includes(term)
        || ((""+item.agreementType).toLowerCase()+" - "+item.agreementDescription.toLowerCase()).includes(term)
        || (item.calculatedBy === 'M' ? 'Manual' : 'Boris Calculated').toLowerCase().includes(term)
        || this.getFormattedDate(item.effectiveDate, term)
        || this.getFormattedDate(item.expirationDate, term);
    });
  }

  getFormattedDate(item: any, term:string){
    if(item !== null){
      let date = this.datePipe.transform(item,'MM/dd/yyyy');
      return(date?.toString().includes(term));
    }else{
      return false
    }
  }

  handleDeleteTreaty(id: any) {
    let modalDetails = {
      'action': 'deleteTreaty',
      'isEditMode': false,
      'modalData': {borisId : id},
      'modalSubject': 'deleteTreaty'
    }
    this.initiateConfirmModal(modalDetails);
  }

  deleteTreaty(query:any) {
    this.treatyService.deleteTreaty(query)
      .subscribe(res => {
        if(this.commonService.validateAPIResponse(res)){
        this.getTreatyList(this.searchQueryObj);
        this.initiateStatusModal({
          status: 'success',
          modalSubject: 'deleteTreaty'
        });
       }else{
        this.triggerErrorAlert('deleteTreaty');
       }
      }, (err) => {
        this.triggerErrorAlert('deleteTreaty');
      });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.modalActions.unsubscribe();
  }


}
