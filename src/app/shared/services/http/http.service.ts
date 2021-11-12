import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { APP_CONFIG, AppConfig } from '../../../app.config';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  public baseUrl = this.config.appCredentials.baseUrl;
  constructor(@Inject(APP_CONFIG) private config: AppConfig, public http: HttpClient,
    private commonService: CommonService) {
  }


  public GET(urlString: string, query: any, urlType: any): Observable<any> {
    return this.http.get(this.baseUrl + urlString, {params: query})
      .pipe(
        map(data => data),
        tap(_ => this.commonService.log(urlType)),
        catchError(err => {
          this.commonService.handleError(urlType, err);
          return err;
        })
      )
  }

  public PUT(urlString: string, data: any, urlType: any): Observable<any> {
    return this.http.put(this.baseUrl + urlString, data)
      .pipe(
        map(data => data),
        tap(_ => this.commonService.log(urlType)),
        catchError(err => {
          this.commonService.handleError(urlType, err);
          return throwError(err);
        })
      )
  }

  public POST(urlString: string, data: any, urlType: any): Observable<any> {
    return this.http.post(this.baseUrl + urlString, data)
      .pipe(
        map(data => data),
        tap(_ => this.commonService.log(urlType)),
        catchError(err => {
          this.commonService.handleError(urlType, err);
          return throwError(err);
        })
      )
  }

  public DELETE(urlString: string, query:any, urlType: any, data?: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: data ? data : {}
    };
    console.log(options)
    return this.http.delete(this.baseUrl + urlString, {params: query})
      .pipe(
        map(data => data),
        tap(_ => this.commonService.log(urlType)),
        catchError(err => {
          this.commonService.handleError(urlType, err);
          return err;
        })
      )
  }

}
