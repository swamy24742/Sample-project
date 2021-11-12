import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../shared/services';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {

  treatyList: any = [];

  constructor(private apiService: HttpService) { }

  getTreatyLists(): any {
    return this.treatyList;
  }

  setTreatyLists(data: any): any {
    this.treatyList = data;
  }

  getTreatyDetails(query: any): Observable<any> {
    let urlString = '/treaty/getdetail';
    return this.apiService.GET(urlString, query, 'getTreatyDetail');
  }

  getSBU(): Observable<any> {
    let urlString = '/claims/sbu';
    return this.apiService.GET(urlString, {}, 'getSBU');
  }

  getLOB(): Observable<any> {
    let urlString = '/claims/lob';
    return this.apiService.GET(urlString, {}, 'getLOB');
  }

  getClaims(query: any): Observable<any> {
    let urlString = '/claims';
    return this.apiService.GET(urlString, query, 'getClaims');
  }

  tagClaims(data:any): Observable<any> {
    let urlString = '/claims';
    return this.apiService.POST(urlString, data, 'tagClaims');
  }

  modifyClaimsData(claimsData: any) {
    return claimsData.map((obj: any) => {
      obj.isChecked = false;
      obj.tagData = {
          isGlobal: false,
          showDetail: false,
          showTag: false,
          claimClass: 'cb-claim-down',
          claimData: {
            claimNo: obj.claimNo,
            policyNo: obj.policyNo,
            taggedClaims:obj.treatyInfo
          }
        }
      return obj;
    })
  }

}
