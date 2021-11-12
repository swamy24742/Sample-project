import { Component, OnInit, HostListener,Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../shared/services';
import { ClaimsService } from '../claims.service';

@Component({
  selector: 'app-claims-tag',
  templateUrl: './claims-tag.component.html',
  styleUrls: ['./claims-tag.component.scss']
})
export class ClaimsTagComponent implements OnInit {

  hideTags:boolean = true;
  @Input() claimsConfig: any;
  @Input() index: any;
  claimsLists:any = [];
  searchTerm: string = '';
  isDisabled:boolean = false;
  taggedClaimsMaster:any;

  hasValidPermission:boolean = false;

  @Output() claimsTagTrigger = new EventEmitter<any>();
  @Output() toggleClaims = new EventEmitter<any>();

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    this.toggleClaims.emit({index: this.index, action:'document'});
    this.claimsConfig.claimData.taggedClaims = JSON.parse(JSON.stringify(this.taggedClaimsMaster));
  }

  constructor(private claimsService: ClaimsService, private authService:AuthService) { }

  ngOnInit(): void {
    if(this.claimsConfig.isGlobal){
      this.claimsConfig.claimData.taggedClaims = [];
    }
    this.taggedClaimsMaster = this.claimsConfig.claimData.taggedClaims;
    if(this.claimsConfig.claimData.taggedClaims.length === 5){
      this.isDisabled = true;
    }else{
      this.isDisabled = false;
    }
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

  toggleClaim(){ 
    if(!this.claimsConfig.showTag){
      if(this.claimsConfig.isGlobal){
        this.claimsConfig.claimData.taggedClaims = [];
        this.taggedClaimsMaster = [];
      }else{
        this.claimsConfig.claimData.taggedClaims = JSON.parse(JSON.stringify(this.taggedClaimsMaster));
      }
      this.setClaimsData();
    }else{
      this.claimsConfig.claimData.taggedClaims = JSON.parse(JSON.stringify(this.taggedClaimsMaster));
    }
    this.toggleClaims.emit({index: this.index, action:'button'});
  }

  setClaimsData(){
    this.claimsLists = [];
    this.claimsLists = this.claimsService.getTreatyLists();
  }

  onCheckBoxChange(values:any, item:any) {
    if(values.currentTarget.checked){
      this.claimsConfig.claimData.taggedClaims.push(item);
      if(this.claimsConfig.claimData.taggedClaims.length >= 5){
        this.isDisabled = true;
      }else{
        this.isDisabled = false;
      }
    }
  }

  onCheckedBoxChange(values:any, selectedItem:any) {
    if(!values.currentTarget.checked){
      this.claimsConfig.claimData.taggedClaims = this.claimsConfig.claimData.taggedClaims.filter((item:any) => item.riAgency !== selectedItem.riAgency);
      this.isDisabled = false;
    }
  }

  showClaimsTag(treatyData:any){
    return !this.claimsConfig.claimData.taggedClaims.find(
      (item:any) => item.riAgency === treatyData.riAgency
    );
  }

  handleClear(){
    if(this.claimsConfig.isGlobal){
      this.claimsConfig.claimData.taggedClaims = [];
      this.isDisabled = false;
    }else{
      this.claimsConfig.claimData.taggedClaims = JSON.parse(JSON.stringify(this.taggedClaimsMaster));
      if(this.claimsConfig.claimData.taggedClaims.length >= 5){
        this.isDisabled = true;
      }else{
        this.isDisabled = false;
      }
    }
  }

  triggerTagging(){
    if(this.claimsConfig.isGlobal){
      this.claimsTagTrigger.emit({type:'global', claimsData: this.claimsConfig.claimData.taggedClaims});
    }else{
      let claimsData = [];
      claimsData.push({claimNo: this.claimsConfig.claimData.claimNo, treatyList:this.claimsConfig.claimData.taggedClaims})
      this.claimsTagTrigger.emit({type:'individual', claimsData: claimsData});
    }
  }

  clearSearch(){
    this.searchTerm = '';
  }

}
