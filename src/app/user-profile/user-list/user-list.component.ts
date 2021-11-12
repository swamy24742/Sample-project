import { Component, OnInit, PipeTransform } from '@angular/core';
import { UserProfile } from '../models/user-profile';
import { CommonService, DataService, AuthService } from '../../shared/services';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageUserComponent } from '../manage-user/manage-user.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  userList: UserProfile[] = [];
  userMasterList: UserProfile[] = [];
  page = 1;
  pageSize = 15;
  collectionSize = 0;
  initialCollectionSize = 0;

  pageOfDisplay: string = '';

  modalActions: Subscription;
  manageUserModalRef: any = '';
  searchQueryObj: any = {};

  dataLoaded: boolean = false;
  currentPage: string = "Manage User Profile";
  searchParam = 'user';

  hasValidPermission: boolean = false;

  constructor(private modalService: NgbModal, private dataService: DataService, private commonService: CommonService,
    private userService: UserService, private authService:AuthService) {
    this.modalActions = this.dataService.modalActions$.subscribe((data: any) => {
      console.log('subscribe modal actions', data.message);
      
      this.handleModalActions(data.message);
    });
  }

  ngOnInit(): void {
    this.getUserAccessDetails();
    this.getUserCategories();
    this.searchQueryObj = { ...this.searchQueryObj, PageNumber: this.page, PageSize: this.pageSize };
    this.getUserList(this.searchQueryObj);
  }

  getUserAccessDetails(){
    let accessDetails = this.authService.getUserData().accessDetails;
    if(accessDetails['User Profile'] === 'Edit'){
      this.hasValidPermission = true;
    }else{
      this.hasValidPermission = false;
    }
  }


  getUserCategories() {
    this.userService.getUserCategories()
      .subscribe(res => {
        console.log('success getUserCategories @user-list component', res);
        this.commonService.setSystemRoles(res.Result);
      }, (err) => {
        console.log('error getUserCategories @user-list component', err);
        this.commonService.setSystemRoles([]);
        //this.commonService.hideLoader();
      });
  }

  getUserList(query: any) {
    this.dataLoaded = false;
    this.userService.getUsers(query)
      .subscribe(res => {
        let data = res;
        this.dataLoaded = true;
        if(this.commonService.validateAPIResponse(res)){
          let res = data.Result;
          this.userMasterList  = res.userInfo;
          this.collectionSize = res.totalCount;
          this.initialCollectionSize = res.totalCount;
        }else{
          this.userMasterList  = [];
          this.collectionSize = 0;
          this.initialCollectionSize = 0;
        }
        this.handleuserList();
        console.log(res);
      }, (err) => {
        this.dataLoaded = true;
        //this.commonService.hideLoader();
      });
  }

  handleuserList() {
    this.userList = this.userMasterList;
    this.displayPageOfLogic();
  }


  handleUserListSearch(data: any, isCleard: boolean) {
    if (!isCleard) {
      this.page = 1;
    }
    this.collectionSize = data.length;
    this.userList = data
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
    let end = (start + this.pageSize) > this.userList.length ? ((start - 1) + this.userList.length) : (start + this.pageSize);
    this.pageOfDisplay = 'Showing ' + '<b>' + start + '</b>' + ' to ' + '<b>' + end + '</b>' + ' out of ' + '<b>' + this.collectionSize + '</b>' + ' entries';
  }

  handlePagination(ev: any) {
    this.page = ev;
    this.searchQueryObj = { ...this.searchQueryObj, PageNumber: this.page, PageSize: this.pageSize };
    this.getUserList(this.searchQueryObj);
  }

  handleUserEdit(index: any) {
    this.handleManageUser(this.userList[index], { isEditMode: true, hasValues: true, isDuplicateError: false });
  }

  handleAddUser() {
    const newUser: UserProfile =
    {
      userId: '',
      firstName: '',
      lastName: '',
      emailId: '',
      managerEmailId: '',
      borisId: 0,
      isActive: false,
      userCategory: '',
      userCategoryId: 0
    };
    this.handleManageUser(newUser, { isEditMode: false, hasValues: false, isDuplicateError: false });
  }

  handleManageUser(data: any, userConfig: any) {
    this.manageUserModalRef = this.modalService.open(ManageUserComponent,
      {
        scrollable: true,
        windowClass: 'cb-manage-user',
        centered: true,
        backdrop: 'static'
      });
    console.log(data);
    console.log(userConfig);
    this.manageUserModalRef.componentInstance.userData = data;
    this.manageUserModalRef.componentInstance.userConfig = userConfig;
  }

  handleModalActions(data: any) {
    console.log(data)
    if (data.modalDetails.action === 'proceed') {
      console.log('proceed',data);
      this.handleConfirmProceedActions(data);
    } else if (data.modalDetails.action === 'cancel') {
      this.handleConfirmCancelActions(data);
    } else if (data.modalDetails.action === 'save') {
      console.log('save');
      this.manageUserModalRef.close();
      this.initiateConfirmModal(data.modalDetails);
    } else {
      this.manageUserModalRef.close();
    }
  }

  handleConfirmProceedActions(data: any) {
    this.commonService.closeConfirmModal();
    switch (data.modalDetails.modalSubject) {
      case "deleteUser":
        this.deleteUser(data.modalDetails.modalData);
        break;
      case "userModalActions":
        data.modalDetails.isEditMode ? this.updateUser(data) : this.createUser(data);
        break;
    }
  }


  handleConfirmCancelActions(data: any) {
    this.commonService.closeConfirmModal();
    switch (data.modalDetails.modalSubject) {
      case "deleteUser":
        //no action
        break;
      case "userModalActions":
        this.handleManageUser(data.modalDetails.modalData, { isEditMode: data.modalDetails.isEditMode, hasValues: true });
        break;
    }
  }
  handleDuplicateTreaty(data: any) {
    console.log(data)
  }
  triggerErrorAlert(modalSubject: string) {
    this.initiateStatusModal({
      status: 'error',
      modalSubject: modalSubject
    });
  }
  initiateConfirmModal(modalDetails: any) {
    this.commonService.initiateConfirmModal(modalDetails);
  }

  initiateStatusModal(configObj: any) {
    this.commonService.initiateStatusModal(configObj);
  }

  triggerSearch(searchData: any) {
    console.log('triggerSearch', searchData);

    if (searchData.type === "soft") {
      let text = searchData.query;
      if (text == undefined || text == null || text == '') {
        this.collectionSize = this.initialCollectionSize;
        this.page = this.searchQueryObj.PageNumber;
        this.handleuserList();
      } else {
        const searchResult = this.search(text);
        this.handleUserListSearch(searchResult, false);
      }
    } else {
      this.page = 1;
      let queryObj = searchData.query;
      this.searchQueryObj = { ...queryObj, PageNumber: this.page, PageSize: this.pageSize };
      this.getUserList(this.searchQueryObj);
    }
  }

  search(text: string): any {
   
    return this.userMasterList.filter((item: any) => {
      const term = text.toLowerCase();
      return (item.firstName.toLowerCase() + ' ' + item.lastName.toLowerCase()).includes(term)
        || item.userId.toLowerCase().includes(term)
        || item.emailId.toString().toLowerCase().includes(term)
        || item.managerEmailId.toLowerCase().includes(term)
        || (item.isActive? 'Active' : 'In-Active').toLowerCase().includes(term)
        || (("" + item.userCategoryId).toLowerCase() + " - " + item.userCategory.toLowerCase()).includes(term)
    });
  }



  handleDeleteUser(id: any) {
    let modalDetails = {
      'action': 'deleteUser',
      'isEditMode': false,
      'modalData': { borisId: id },
      'modalSubject': 'deleteUser'
    }
    this.initiateConfirmModal(modalDetails);
  }

  createUser(data: any) {
    // data.modalData.agreementType = parseInt(data.modalData.agreementType);
    this.userService.createUser(data.modalDetails.modalData).subscribe(res => {
      if (this.commonService.validateAPIResponse(res)) {
        this.getUserList(this.searchQueryObj);
        this.initiateStatusModal({
          status: 'success',
          modalSubject: 'addUser'
        });
      } else {
        this.triggerErrorAlert('addUser');
      }
    }, (err) => {
      if (err.status === 409) {
        this.handleManageUser(data.modalDetails.modalData, { isEditMode: data.modalDetails.isEditMode, hasValues: true, isDuplicateError: true });
      } else {
        this.triggerErrorAlert('addUser');
      }
    })
  }
  updateUser(data: any) {
    // data.modalData.agreementType = parseInt(data.modalData.agreementType);
    this.userService.updateUser(data.modalDetails.modalData).subscribe(res => {
      if (this.commonService.validateAPIResponse(res)) {
        this.getUserList(this.searchQueryObj);
        this.initiateStatusModal({
          status: 'success',
          modalSubject: 'updateUser'
        });
      } else {
        this.triggerErrorAlert('updateUser');
      }
    }, (err) => {
      if (err.status === 409) {
        this.handleManageUser(data.modalData, { isEditMode: data.isEditMode, hasValues: true, isDuplicateError: true });
      } else {
        this.triggerErrorAlert('updateUser');
      }
    })
  }
  deleteUser(query: any) {
    this.userService.deleteUser(query)
      .subscribe(res => {
        if (this.commonService.validateAPIResponse(res)) {
          this.getUserList(this.searchQueryObj);
          this.initiateStatusModal({
            status: 'success',
            modalSubject: 'deleteUser'
          });
        } else {
          this.triggerErrorAlert('deleteUser');
        }
      }, (err) => {
        this.triggerErrorAlert('deleteUser');
      });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.modalActions.unsubscribe();
  }
}


