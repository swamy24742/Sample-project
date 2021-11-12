import { Component, Input, OnInit } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ITreatyConfig, ITreatyItem } from 'src/app/models/treaty-item';
import { CommonService, DataService } from 'src/app/shared/services';
import { TreatyService } from 'src/app/treaty/treaty.service';
import { UserCategory } from '../models/user-category';
import { UserProfile } from '../models/user-profile';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
  @Input() userData!: UserProfile;
  @Input() userConfig!: ITreatyConfig

  title: string = "Add New User";
  actionButtonTitle = "Add";
  userForm!: FormGroup;
  userCategories: UserCategory[] = [
    { userCategoryId: 0, category: 'Select' }
  ];


  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder,
    private treatyService: TreatyService,
    private commonService: CommonService, private dataService: DataService) {
  }

  createForm() {
    this.userForm = this.fb.group({
      borisId: [0],
      userId: ['', [Validators.required,Validators.max(50)]],
      firstName: ['',[Validators.required,Validators.max(50)]],
      lastName: ['',[Validators.required,Validators.max(50)]],
      emailId: ['',[Validators.required,Validators.max(50),Validators.email]],
      userCategoryId: [this.userCategories[0].userCategoryId],
      userCategory: [''],
      managerEmailId: ['',[Validators.required,Validators.max(50),Validators.email]],
      isActive: [true]
    });
  }

  getTreatyList() {
    this.treatyService.getTreaty({}).subscribe(res => {
      this.userForm
    })
  }

  ngOnInit(): void {
    this.createForm();
    console.log('Getting user categories', this.commonService.getUserCategories());

    this.userCategories = [...this.userCategories, ...this.commonService.getUserCategories()];
    this.setFormData();
  }

  setFormData() {
    if (this.userConfig.isEditMode) {
      this.setUpdateValues();
    }
    if (this.userConfig.hasValues) {
      this.bindFormData();
    }
  }

  bindFormData() {
    this.userForm.patchValue({
      userId: this.userData.userId,
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      emailId: this.userData.emailId,
      managerEmailId: this.userData.managerEmailId,
      userCategoryId: this.userCategories[this.commonService.getArrayIndex(this.userCategories, 'userCategoryId', this.userData.userCategoryId.toString())].userCategoryId,
      userCategory: '',
      isActive: this.userData.isActive,
      borisId: this.userData.borisId
    });
  }

  setUpdateValues() {
    this.title = "Update User";
    this.actionButtonTitle = "Update";
  }

  closeModal() {
    console.log('close data');

    this.dataService.sendMessage({
      modalDetails: {
        'action': 'close',
        'isEditMode': this.userConfig.isEditMode,
        'modalData': {},
        'modalSubject': 'userModalActions'
      }
    }, "userModalActions");
  }

  saveModal() {
    let modalData = this.userForm.value;
    modalData.userCategory = this.userCategories[this.commonService.getArrayIndex(this.userCategories, 'userCategoryId', modalData.userCategoryId.toString())].category;

    this.dataService.sendMessage({
      modalDetails: {
        'action': 'save',
        'isEditMode': this.userConfig.isEditMode,
        'modalData': this.userForm.value,
        'modalSubject': 'userModalActions'
      }
    }, "userModalActions");
    //this.activeModal.close(this.treatyForm.value);
  }

  resetModal() {
    this.bindFormData();
  }

}
