import { Component, OnInit, HostListener } from '@angular/core';
import { CommonService, DataService, AuthService } from '../../shared/services';
import { ClaimsService } from '../claims.service';
import { Subscription } from 'rxjs';

export interface IClaimsTagConfig {
  isGlobal: boolean,
  claimData: any,
  showDetail: boolean,
  showTag: boolean,
  claimClass: string
}

@Component({
  selector: 'app-claims-listing',
  templateUrl: './claims-listing.component.html',
  styleUrls: ['./claims-listing.component.scss']
})
export class ClaimsListingComponent implements OnInit {

  claimsTagGlobalConfig: IClaimsTagConfig = {
    isGlobal: true,
    showDetail: false,
    showTag: false,
    claimClass: 'cb-claim-down',
    claimData: {
      claimNo: 'Global',
      policyNo: '',
      taggedClaims: []
    }
  }

  page = 1;
  pageSize = 20;
  collectionSize = 0;
  initialCollectionSize = 0;

  claimsMasterList: any = [];
  claimsList: any = [];
  pageOfDisplay: string = '';

  currentIndex: number = 0;

  searchQueryObj: any = {};
  dataLoaded: boolean = false;
  currentPage: string = "Claims Tagging for Reinsurance Accounting";

  modalActions: Subscription;

  selectedClaims: any = []
  selectedFilter: string = 'none';
  showFilter: boolean = false;

  searchMode:boolean = true;
  hasValidPermission:boolean = false;

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    this.showFilter = false;
  }

  constructor(private commonService: CommonService, private claimsService: ClaimsService, private dataService: DataService, private authService:AuthService) {
    this.modalActions = this.dataService.modalActions$.subscribe((data: any) => {
      this.handleModalActions(data.message);
    });
  }

  ngOnInit(): void {
    this.getTreatyDetails();
    this.getUserAccessDetails();
  }

  getUserAccessDetails(){
    let accessDetails = this.authService.getUserData().accessDetails;
    if(accessDetails['Claims Tagging'] === 'Edit'){
      this.hasValidPermission = true;
    }else{
      this.hasValidPermission = false;
    }
  }

  getTreatyDetails() {
    this.claimsService.getTreatyDetails({ searchText: '' })
      .subscribe(res => {
        let data = res;
        if (this.commonService.validateAPIResponse(res)) {
          let res = data.Result;
          this.claimsService.setTreatyLists(res);
        } else {
          this.claimsService.setTreatyLists([]);
        }
      }, (err: any) => {
        this.claimsService.setTreatyLists([]);
      });
  }

  getClaimsList(query: any, showLoader:boolean) {
    if(showLoader){
      this.commonService.showLoader();
    }
    this.dataLoaded = false;
    this.claimsService.getClaims(query)
      .subscribe(res => {
        this.commonService.hideLoader();
        let data = res;
        this.dataLoaded = true;
        if (this.commonService.validateAPIResponse(res)) {
          let res = data.Result;
          //let res = this.data;
          this.claimsMasterList = res.claimsTagging;
          this.collectionSize = res.totalCount;
          this.initialCollectionSize = res.totalCount;
        } else {
          this.claimsMasterList = [];
          this.collectionSize = 0;
          this.initialCollectionSize = 0;
        }
        this.claimsMasterList = this.claimsService.modifyClaimsData(this.claimsMasterList);
        console.log(this.claimsMasterList);
        this.handleClaimsList();
      }, (err) => {
        this.dataLoaded = true;
        this.commonService.hideLoader();
      });
  }

  handleClaimsList() {
    this.claimsList = this.claimsMasterList;
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
    let end = (start + this.pageSize) > this.claimsList.length ? ((start - 1) + this.claimsList.length) : (start + this.pageSize);
    this.pageOfDisplay = 'Showing ' + '<b>' + start + '</b>' + ' to ' + '<b>' + end + '</b>' + ' out of ' + '<b>' + this.collectionSize + '</b>' + ' entries';
  }

  triggerSearch(searchData: any) {
    this.searchMode = false;
    this.page = 1;
    let queryObj = searchData.query;
    this.searchQueryObj = { ...queryObj, PageNumber: this.page, PageSize: this.pageSize };
    this.getClaimsList(this.searchQueryObj, true);
  }

  handlePagination(ev: any) {
    this.page = ev;
    this.searchQueryObj = { ...this.searchQueryObj, PageNumber: this.page, PageSize: this.pageSize };
    this.selectedClaims = [];
    this.selectedFilter = "none";
    this.getClaimsList(this.searchQueryObj, true);
  }

  handleClaimsToggle(data: any) {
    if (this.claimsList.length > 0) {
      if (data.action === 'document') {
        this.claimsTagGlobalConfig.showTag = false;
        if (this.currentIndex !== -1) {
          this.claimsList[this.currentIndex]['tagData'].showTag = false;
          this.currentIndex = 0;
        }
      } else {
        let index = data.index;
        if (index === -1) {
          this.claimsList[this.currentIndex]['tagData'].showTag = false;
          this.claimsTagGlobalConfig.showTag = !this.claimsTagGlobalConfig.showTag;
          this.currentIndex = 0;
        } else {
          if (this.currentIndex !== index) {
            this.claimsList[this.currentIndex]['tagData'].showTag = false;
            this.claimsTagGlobalConfig.showTag = false;
            this.currentIndex = index;
            let element = index + 1;
            if (element > (this.claimsList.length - 6)) {
              this.claimsList[index]['tagData'].claimClass = 'cb-claim-up';
            } else {
              this.claimsList[index]['tagData'].claimClass = 'cb-claim-down';
            }
            this.claimsList[index]['tagData'].showTag = !this.claimsList[index]['tagData'].showTag;
          } else {
            this.claimsList[index]['tagData'].showTag = !this.claimsList[index]['tagData'].showTag;
          }
        }
      }
    }
  }

  handleClaimsTrigger(data: any) {
    if (data.type === 'global') {
      this.handleGlobalClaimsTagging(data.claimsData);
    } else {
      let confirmModalData = {
        'action': 'tag',
        'isEditMode': (data.claimsData[0].treatyList.length > 0) ? false : true,
        'modalData': data.claimsData,
        'modalSubject': 'tagClaims'
      }
      this.initiateConfirmModal(confirmModalData);
    }
  }

  handleGlobalClaimsTagging(data: any) {
    let claimsData: any = [];
    this.selectedClaims.forEach((item: any) => {
      claimsData.push({ claimNo: item, treatyList: data });
    });
    let confirmModalData = {
      'action': 'tag',
      'isEditMode': false,
      'modalData': claimsData,
      'modalSubject': 'tagClaims'
    }
    this.initiateConfirmModal(confirmModalData);
  }

  initiateConfirmModal(modalDetails: any) {
    this.commonService.initiateConfirmModal(modalDetails);
  }

  handleModalActions(data: any) {
    if (data.modalDetails.action === 'proceed') {
      this.handleConfirmProceedActions(data);
    } else if (data.modalDetails.action === 'cancel') {
      this.handleConfirmCancelActions(data);
    }
  }

  handleConfirmProceedActions(data: any) {
    this.commonService.closeConfirmModal();
    switch (data.modalDetails.modalSubject) {
      case "tagClaims":
        this.tagClaims(data.modalDetails.modalData);
        this.claimsTagGlobalConfig.showTag = false;
        this.claimsList[this.currentIndex]['tagData'].showTag = false;
        this.currentIndex = 0;
        break;
    }
  }

  handleConfirmCancelActions(data: any) {
    switch (data.modalDetails.modalSubject) {
      case "tagClaims":
        this.commonService.closeConfirmModal();
        break;
    }
  }

  tagClaims(data: any) {
    let claimStatus = 'tagClaims';
    if(data.length === 1){
      if(data[0].treatyList.length === 0){
        claimStatus = 'untagClaims';
      }
    }
    this.claimsService.tagClaims(data).subscribe(res => {
      if (this.commonService.validateAPIResponse(res)) {
        this.selectedClaims = [];
        this.getClaimsList(this.searchQueryObj, false);
        this.initiateStatusModal({
          status: 'success',
          modalSubject: claimStatus
        });
      } else {
        this.triggerErrorAlert('tagClaims');
      }
    }, (err) => {
      this.triggerErrorAlert('tagClaims');
    })
  }

  triggerErrorAlert(modalSubject: string) {
    this.initiateStatusModal({
      status: 'error',
      modalSubject: modalSubject
    });
  }

  initiateStatusModal(configObj: any) {
    this.commonService.initiateStatusModal(configObj);
  }

  onGlobalCheckBoxChange(values: any) {
    if (values.currentTarget.checked) {
      this.selectedClaims = [];
      this.claimsList.forEach((item: any) => {
        item.isChecked = true;
        this.selectedClaims.push(item.claimNo);
        this.selectedFilter = "all";
      });
    } else {
      this.selectedClaims = [];
      this.claimsList.forEach((item: any) => {
        item.isChecked = false;
      });
      this.selectedFilter = "none";
    }
  }

  onItemCheckBoxChange(values:any, claimNo:any, index:any){
    if (values.currentTarget.checked) {
      this.selectedClaims.push(claimNo);
      this.claimsList[index].isChecked = true;
    }else{
        let itemIndex = this.selectedClaims.indexOf(claimNo);
        if (itemIndex > -1) {
          this.selectedClaims.splice(itemIndex, 1);
          this.claimsList[index].isChecked = false;
        }
    }
  }

  setFilter(item: string) {
    this.selectedFilter = item;
    this.handleCheckboxes();
  }

  handleCheckboxes() {
    console.log('here');
    this.selectedClaims = [];
    if (this.selectedFilter === "all") {
      this.claimsList.forEach((item: any) => {
        item.isChecked = true;
        this.selectedClaims.push(item.claimNo);
      });
    }else if(this.selectedFilter === "tag"){
      this.claimsList.forEach((item: any) => {
        if(item.treatyInfo.length > 0){
          item.isChecked = true;
          this.selectedClaims.push(item.claimNo);
        }else{
          item.isChecked = false;
        }
      });
    }else if(this.selectedFilter === "untag"){
      this.claimsList.forEach((item: any) => {
        if(item.treatyInfo.length === 0){
          item.isChecked = true;
          this.selectedClaims.push(item.claimNo);
        }else{
          item.isChecked = false;
        }
      });
    }else{
      this.claimsList.forEach((item: any) => {
        item.isChecked = false;
        this.selectedFilter = "none";
      });
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.modalActions.unsubscribe();
  }

}
