import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { AuthService, CommonService } from '../../shared/services';

@Injectable()
export class ServiceInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private commonService : CommonService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    //return next.handle(request);
    if(!request.headers.has('content-type')){
      request = request.clone({'headers': request.headers.set('Content-Type', 'application/json')});
    }
    request = request.clone({'headers': request.headers.set('Accept', 'application/json')});
    let token = this.authService.getUserToken();
    if(!request.url.includes('auth/login')){
      request = request.clone({'headers': request.headers.set('Authorization', 'Bearer '+token)})
    }
    return next.handle(request).pipe(
      // tap(
      //   (data: HttpEvent<any>) => {
      //     console.log(`Call to the API ${request.url} succeeded`);
      //   },
      //   (error: HttpErrorResponse) =>
      //   console.log(`Call to the API ${request.url} failed with status ${error.status}`)
      // ),
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((err:any) => {
        switch (err.status) {
          case 401:
            this.handle401Error(err);
            break;
          case 403:
            this.handle403Error(err);
            break;
        }
        return throwError(err);
      })
    );
  }

  handle401Error(err:any){
    this.authService.refreshUserSession();
  }

  handle403Error(err:any){
    this.commonService.initiateStatusModal({
      status: 'error',
      modalSubject: 'invalidPermission'
    });
  }

}
