import { Component, OnInit,  Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { CommonService, DataService} from '../../shared/services';
import { ClaimsService } from '../claims.service';

@Component({
  selector: 'app-claims-search',
  templateUrl: './claims-search.component.html',
  styleUrls: ['./claims-search.component.scss']
})
export class ClaimsSearchComponent implements OnInit {

  searchForm!: FormGroup;
  minSearch:boolean = true;

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

  // other options are here...
  dateOfLossOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'mm/dd/yyyy',
    appendSelectorToBody: true,
    openSelectorTopOfInput: true,
    // other options are here...
  };

  lineOfBusiness = [
    {name: "Select", typecode: ""}
  ];
  sbuDetails = [
    {name: "Select", typecode: ""}
  ];

  @Output() onSearch = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private commonService: CommonService, private claimsService: ClaimsService) { }

  ngOnInit(): void {
    this.getLOB();
    this.getSBU();
    this.initializeSearchForm();
  }

  initializeSearchForm(){
    this.searchForm = this.fb.group({
      claimNo: [''],
      policyNo: [],
      lineOfBznz: ['Select'],
      dateOfLoss: [],
      effectiveDate: [],
      expirationDate: [],
      sbu: ['Select'],
      grossIncuredLesser: [],
      grossIncuredGreater: [],
      netIncuredLesser:[],
      netIncuredGreater:[]
    });
  }

  getSBU() {
    this.claimsService.getSBU()
      .subscribe(res => {
        let data = res;
        if(this.commonService.validateAPIResponse(res)){
          this.sbuDetails = [ ...this.sbuDetails, ...res.Result];
        }
      }, (err:any) => {
        
      });
  }

  getLOB() {
    this.claimsService.getLOB()
      .subscribe(res => {
        let data = res;
        if(this.commonService.validateAPIResponse(res)){
          this.lineOfBusiness = [ ...this.lineOfBusiness, ...res.Result];
        }
      }, (err:any) => {
        
      });
  }

  toggleSearch(){
    this.minSearch = !this.minSearch;
  }

  clearSearch(){
    this.initializeSearchForm();
  }

  triggerSearch(){
    let queryObj = {};
      if(this.searchForm.value.claimNo){
        queryObj = { ...queryObj, ClaimNo: this.searchForm.value.claimNo};
      }
      if(this.searchForm.value.policyNo){
        queryObj = { ...queryObj, PolicyNo: this.searchForm.value.policyNo};
      }
      if(this.searchForm.value.lineOfBznz && (this.searchForm.value.lineOfBznz !== 'Select')){
        queryObj = { ...queryObj, LineOfBusiness: this.searchForm.value.lineOfBznz};
      }
      if(this.searchForm.value.dateOfLoss){
        queryObj = { ...queryObj, DateOfLoss: this.commonService.formatRequestDateFormat(this.searchForm.value.dateOfLoss.singleDate.formatted)};
      }
      if(this.searchForm.value.effectiveDate){
        queryObj = { ...queryObj, EffectiveDate: this.commonService.formatRequestDateFormat(this.searchForm.value.effectiveDate.singleDate.formatted)};
      }
      if(this.searchForm.value.expirationDate){
        queryObj = { ...queryObj, ExpirationDate: this.commonService.formatRequestDateFormat(this.searchForm.value.expirationDate.singleDate.formatted)};
      }
      if(this.searchForm.value.sbu && (this.searchForm.value.sbu !== 'Select')){
        queryObj = { ...queryObj, SBU: this.searchForm.value.sbu};
      }
      if(this.searchForm.value.grossIncuredLesser){
        queryObj = { ...queryObj, GrossIncuredLess: this.searchForm.value.grossIncuredLesser};
      }
      if(this.searchForm.value.grossIncuredGreater){
        queryObj = { ...queryObj, GrossIncuredGreater: this.searchForm.value.grossIncuredGreater};
      }
      if(this.searchForm.value.netIncuredLesser){
        queryObj = { ...queryObj, NetIncuredLess: this.searchForm.value.netIncuredLesser};
      }
      if(this.searchForm.value.netIncuredGreater){
        queryObj = { ...queryObj, NetIncuredGreater: this.searchForm.value.netIncuredGreater};
      }

      //console.log(this.searchForm.value.treatyEffectiveDate);
      this.onSearch.emit({query: queryObj, type: 'advanced'});
    }

}
