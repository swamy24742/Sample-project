import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../shared/services';

@Injectable({
  providedIn: 'root'
})
export class TreatyService {

  constructor(private apiService: HttpService) { }

  getTreaty(query:any): Observable<any> {
    let urlString = '/treaty';
    return this.apiService.GET(urlString, query, 'getTreaty');
  }

  getAgreementType(): Observable<any> {
    let urlString = '/agreementtype';
    return this.apiService.GET(urlString, {}, 'getAgreement');
  }

  createTreaty(data:any): Observable<any> {
    let urlString = '/treaty';
    return this.apiService.POST(urlString, data, 'createTreaty');
  }

  updateTreaty(data:any): Observable<any> {
    let urlString = '/treaty';
    return this.apiService.PUT(urlString, data, 'updateTreaty');
  }

  deleteTreaty(query:any): Observable<any> {
    let urlString = '/treaty';
    return this.apiService.DELETE(urlString, query, 'deleteTreaty');
  }

}
