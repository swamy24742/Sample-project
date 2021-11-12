import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { AgreementType } from 'src/app/models/agreement-type.model';
import { ITreatyItem, ITreatyConfig } from 'src/app/models/treaty-item';
import { CommonService, DataService } from '../../shared/services';
import { TreatyService } from '../treaty.service';

@Component({
  providers: [NgbActiveModal, FormBuilder],
  selector: 'app-manage-treaty',
  templateUrl: './manage-treaty.component.html',
  styleUrls: ['./manage-treaty.component.scss']
})
export class ManageTreatyComponent implements OnInit {

  @Input() treatyData!: ITreatyItem;
  @Input() treatyConfig!: ITreatyConfig
  title: string = "Add New Treaty";
  actionButtonTitle = "Add";
  isBorisCalc: boolean = false;
  disableExpiry: boolean = false;


  effectiveDateOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'mm/dd/yyyy',
    appendSelectorToBody: true,
    openSelectorTopOfInput: true,
    // other options are here...
  };


  // other options are here...
  expiryDateOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'mm/dd/yyyy',
    appendSelectorToBody: true,
    openSelectorTopOfInput: true,
    // other options are here...
  };
  treatyForm!: FormGroup;
  ispastExpiryDate: boolean = false;
  agreementType = [
    { borisId: "", typeCode: "", description: 'Select' }
  ];
  calculationType = [
    { key: "", value: 'Select' },
    { key: "B", value: "Boris Calculated" },
    { key: "M", value: "Manual" }
  ];

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private treatyService: TreatyService, private commonService: CommonService, private dataService: DataService) {
  }

  createForm() {
    this.treatyForm = this.fb.group({
      borisId: [0],
      tradingPartner: [''],
      cededNo: ['', [Validators.required,Validators.minLength(4), Validators.maxLength(4)]],
      riAgency: ['', [Validators.required, Validators.minLength(5),Validators.maxLength(5)]],
      treatyName: ['', [Validators.required, Validators.max(100)]],
      effectiveDate: ['', [Validators.required]],
      expirationDate: ['', [Validators.required]],
      agreementType: [this.agreementType[0].typeCode, [Validators.required]],
      calculatedBy: [this.calculationType[0].key, [Validators.required]]
    }
      , { validator: [this.expiryValidation('effectiveDate', 'expirationDate')] }
    );
  }

  changeCalculationType() {
    var method = this.treatyForm.controls['calculatedBy'].value;
    if (method == "B") {
      console.log('Clear Validations');
      this.isBorisCalc = true;
      this.handleBorisExpiry();
      this.treatyForm.get('effectiveDate')?.clearValidators();
      this.treatyForm.get('effectiveDate')?.updateValueAndValidity();
      this.treatyForm.get('expirationDate')?.clearValidators();
      this.treatyForm.get('expirationDate')?.updateValueAndValidity();
    } else {
      this.isBorisCalc = false;
      this.disableExpiry = false;
      this.treatyForm.controls['effectiveDate'].setValidators([Validators.required]);
      this.treatyForm.controls['effectiveDate'].updateValueAndValidity();
      this.treatyForm.controls['expirationDate'].setValidators([Validators.required]);
      this.treatyForm.controls['expirationDate'].updateValueAndValidity();

    }
  }

  handleBorisExpiry() {
    if(this.treatyForm.value.effectiveDate){
      this.disableExpiry = false;
    }else{
      this.treatyForm.patchValue({expirationDate: null});
      this.disableExpiry = true;
    }
  }

  ngOnInit(): void {
    this.createForm();
    this.agreementType = [...this.agreementType, ...this.commonService.getAgreementLists()];
    this.setFormData();
  }

  setFormData() {
    if (this.treatyConfig.isEditMode) {
      this.setUpdateValues();
    }
    if (this.treatyConfig.hasValues) {
      this.bindFormData();
    }
  }

  bindFormData(){
      let date = new Date(this.treatyData.effectiveDate);
      let expiryDate = new Date(this.treatyData.expirationDate);
      this.treatyForm.patchValue({
        borisId: this.treatyData.borisId,
        tradingPartner: this.treatyData.tradingPartner,
        cededNo: this.treatyData.cededNo,
        riAgency: this.treatyData.riAgency,
        treatyName: this.treatyData.treatyName,
        agreementType: this.agreementType[this.commonService.getArrayIndex(this.agreementType, 'typeCode', this.treatyData.agreementType)].typeCode,
        calculatedBy: this.calculationType[this.commonService.getArrayIndex(this.calculationType, 'key', this.treatyData.calculatedBy)].key,
        effectiveDate: (this.treatyData.effectiveDate !== null && !isNaN(date.getTime())) ? {
          isRange: false, singleDate: {
            date: {
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              day: date.getDate()
            }
          }
        } : '',
        expirationDate: (this.treatyData.expirationDate !== null && !isNaN(expiryDate.getTime())) ? {
          isRange: false, singleDate: {
            date: {
              year: expiryDate.getFullYear(),
              month: expiryDate.getMonth() + 1,
              day: expiryDate.getDate()
            }
          }
        } : ''
      });
      this.changeCalculationType();
  }

  setUpdateValues() {
    this.title = "Update Treaty";
    this.actionButtonTitle = "Update";
  }

  onDateChanged(event: any): void {
    if (event.singleDate.formatted !== "") {
      this.treatyForm.controls['effectiveDate'].setValidators([Validators.required]);
      this.treatyForm.controls['effectiveDate'].updateValueAndValidity();
    } else {
      if (this.treatyForm.value.effectiveDate) {
        this.treatyForm.controls['expirationDate'].setValidators([Validators.required]);
        this.treatyForm.controls['expirationDate'].updateValueAndValidity();
      }else{
        this.changeCalculationType();
      }
    }
  }

  onEffectiveDateChanged(event: any): void {
    // date selected
    if (event.singleDate.formatted !== "") {
      this.treatyForm.controls['expirationDate'].setValidators([Validators.required]);
      this.treatyForm.controls['expirationDate'].updateValueAndValidity();
    } else {
      if (this.treatyForm.value.expirationDate) {
        this.treatyForm.controls['effectiveDate'].setValidators([Validators.required]);
        this.treatyForm.controls['effectiveDate'].updateValueAndValidity();
      }else{
        this.changeCalculationType();
      }
    }
  }

  closeModal() {
    this.dataService.sendMessage({
      modalDetails: {
        'action': 'close',
        'isEditMode': this.treatyConfig.isEditMode,
        'modalData': {},
        'modalSubject': 'treatyModalActions'
      }
    }, "treatyModalActions");
  }

  saveModal() {
    let modalData = this.treatyForm.value;
    if(modalData.effectiveDate && modalData.effectiveDate.singleDate){
      modalData.effectiveDate = this.commonService.formatDefaultDateFormat(modalData.effectiveDate.singleDate.date);
    }else{
      modalData.effectiveDate = null;
    }
    if(modalData.expirationDate && modalData.expirationDate.singleDate){
      modalData.expirationDate = this.commonService.formatDefaultDateFormat(modalData.expirationDate.singleDate.date);
    }else{
      modalData.expirationDate = null;
    }
    if(modalData.tradingPartner === ''){
      modalData.tradingPartner = null;
    }
    this.dataService.sendMessage({
      modalDetails: {
        'action': 'save',
        'isEditMode': this.treatyConfig.isEditMode,
        'modalData': this.treatyForm.value,
        'modalSubject': 'treatyModalActions'
      }
    }, "treatyModalActions");
    //this.activeModal.close(this.treatyForm.value);
  }

  resetModal() {
    this.bindFormData();
  }

  expiryValidation(from: any, to: any) {
    return (group: FormGroup): { [key: string]: any } => {
      let fromDate = group.controls[from];
      let toDate = group.controls[to];
      if (fromDate.value && group.controls['effectiveDate'].valid && toDate.value && group.controls['expirationDate'].valid) {
        let fromDateDetails = fromDate.value.singleDate.date;
        let toDateDetails = toDate.value.singleDate.date;
        if (!this.commonService.compareDate(fromDateDetails, toDateDetails)) {
          this.ispastExpiryDate = true;
          return {
            'lessExpiry': true
          };
        } else {
          this.ispastExpiryDate = false;
        }
      }
      return {};
    }
  }

}
