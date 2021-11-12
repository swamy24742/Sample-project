import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { CommonService } from '../../services';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [FormBuilder]
})
export class SearchComponent {

  showFilter: boolean = false;
  showFilterIcon: boolean = true;
  searchFilter = new FormControl('');
  searchForm!: FormGroup;

  @Input() page: any;
  @Output() onSearch = new EventEmitter<any>();

  effectiveDateOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'mm/dd/yyyy',
    appendSelectorToBody: false,
    openSelectorTopOfInput: true,
    closeSelectorOnDocumentClick: true,
    stylesData: {
      selector: 'effective-date',  // unique class selector string
      styles: ``
    }
  };
  expiryDateOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'mm/dd/yyyy',
    appendSelectorToBody: false,
    openSelectorTopOfInput: true,
    closeSelectorOnDocumentClick: true,
    stylesData: {
      selector: 'exp-date',  // unique class selector string
      styles: ``
    }
  };

  agreementType = [
    { borisId: "", typeCode: "", description: 'Select' }
  ]
  calculationType = [
    { key: "", value: 'Select' },
    { key: "B", value: "Boris Calculated" },
    { key: "M", value: "Manual" }
  ];

  userCategories = [
    { userCategoryId: 0, category: 'Select' }
  ]

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    this.showFilter = false;
  }

  constructor(private fb: FormBuilder, private commonService: CommonService) {
  }

  ngOnInit(): void {
    this.initializeSearchForm();
    this.subscribeToSearch();
  }

  initializeSearchForm() {
    console.log(this.page)
    if (this.page === 'user') {
      this.searchForm = this.fb.group({
        userId: [''],
        emailId: [''],
        managerEmailId: [''],
        firstName: [''],
        lastName: [''],
        isActive: [true],
        userCategory: [this.userCategories[0].userCategoryId],
      });
    } else {
      this.searchForm = this.fb.group({
        CededNo: [],
        TradingPartner: [],
        RIAgency: [],
        treatyName: [],
        agreementType: [this.agreementType[0].typeCode],
        calculationValue: [''],
        treatyEffectiveDate: [],
        treatyExpirationDate: []
      });
    }
  }

  changeCalculationType() {

  }

  clearSearchInput(){
    this.searchFilter.setValue('');
  }

  subscribeToSearch() {
    this.searchFilter.valueChanges.subscribe(text => {
      this.onSearch.emit({ query: text, type: 'soft' });
    });
  }

  handleSearch(isReset: boolean) {
    if (this.page === 'user') {
      this.handleUserSearch(isReset);
    } else {
      this.handleTreatySearch(isReset);
    }
  }

  handleTreatySearch(isReset: boolean) {
    let queryObj = {};
    if (this.searchForm.value.CededNo) {
      queryObj = { ...queryObj, CededNo: this.searchForm.value.CededNo };
    }
    if (this.searchForm.value.TradingPartner) {
      queryObj = { ...queryObj, TradingPartner: this.searchForm.value.TradingPartner };
    }
    if (this.searchForm.value.RIAgency) {
      queryObj = { ...queryObj, RIAgency: this.searchForm.value.RIAgency };
    }
    if (this.searchForm.value.treatyName) {
      queryObj = { ...queryObj, TreatyName: this.searchForm.value.treatyName };
    }
    if (this.searchForm.value.agreementType) {
      queryObj = { ...queryObj, AgreementType: this.searchForm.value.agreementType };
    }
    if (this.searchForm.value.calculationValue) {
      queryObj = { ...queryObj, CalculatedBy: this.searchForm.value.calculationValue };
    }
    if (this.searchForm.value.treatyEffectiveDate) {
      queryObj = { ...queryObj, EffectiveDate: this.commonService.formatRequestDateFormat(this.searchForm.value.treatyEffectiveDate.singleDate.formatted) };
    }
    if (this.searchForm.value.treatyExpirationDate) {
      queryObj = { ...queryObj, ExpirationDate: this.commonService.formatRequestDateFormat(this.searchForm.value.treatyExpirationDate.singleDate.formatted) };
    }
    //console.log(this.searchForm.value.treatyEffectiveDate);
    this.onSearch.emit({ query: queryObj, type: 'advanced' });
    if (isReset) {
      this.showFilter = true;
    } else {
      this.showFilter = false;
    }
  }

  handleUserSearch(isReset: boolean) {
    let queryObj = {};

    if (!isReset) {
      if (this.searchForm.value.userId) {
        queryObj = { ...queryObj, userId: this.searchForm.value.userId };
      }

      if (this.searchForm.value.firstName) {
        queryObj = { ...queryObj, firstName: this.searchForm.value.firstName };
      }

      if (this.searchForm.value.lastName) {
        queryObj = { ...queryObj, lastName: this.searchForm.value.lastName };
      }

      if (this.searchForm.value.emailId) {
        queryObj = { ...queryObj, emailId: this.searchForm.value.emailId };
      }
      if (this.searchForm.value.userCategory) {
        queryObj = { ...queryObj, UserCategoryId: this.searchForm.value.userCategory };
      }
      if (this.searchForm.value.managerEmailId) {
        queryObj = { ...queryObj, managerEmailId: this.searchForm.value.managerEmailId };
      }
      if (this.searchForm.value.isActive != undefined) {
        queryObj = { ...queryObj, isActive: this.searchForm.value.isActive }
      }
    }
    this.onSearch.emit({ query: queryObj, type: 'advanced' });
    if (isReset) {
      this.showFilter = true;
    } else {
      this.showFilter = false;
    }
  }


  onDateChanged(event: IMyDateModel): void {
    // date selected
  }

  resetModal() {
    this.initializeSearchForm();
    this.handleSearch(true);
  }

  toggleFilter() {
    window.scrollTo({ top: 100, behavior: 'smooth' })
    if (!this.showFilter) {
      if (this.page === 'user') {
        if (this.userCategories.length === 1) {
          this.userCategories = [...this.userCategories, ...this.commonService.getUserCategories()];
        }
      } else {
        if (this.agreementType.length === 1) {
          this.agreementType = [...this.agreementType, ...this.commonService.getAgreementLists()];
        }
      }
    }
    this.showFilter = !this.showFilter;
  }

  onFocusEvent(event: any) {
    //this.showFilterIcon = true;
  }

  onFocusOutEvent(event: any) {
    //this.showFilterIcon = false;
  }

}
