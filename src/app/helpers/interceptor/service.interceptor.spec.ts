import { TestBed } from '@angular/core/testing';
import { ServiceInterceptor } from './service.interceptor';
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { HttpService } from '../../shared/services';
import { enums } from '../../enumerations/enum';
import { AppConstants } from '../../enumerations/app-constants';
import { environment } from '../../../environments/environment';
import { APP_CONFIG } from '../../app.config';

describe("LoggingInterceptorService tests", () => {
  let httpTestingController: HttpTestingController,
    service: HttpService,
    httpClient: HttpClient;
 
  beforeEach(() => {
 
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ServiceInterceptor,
          multi: true
        },
        {
          provide: APP_CONFIG, useValue: {
            appCredentials: environment.appCredentials,
            appConstants: AppConstants.labels,
            enums: enums,
          }
        }
        // {
        //   provide: HTTP_INTERCEPTORS,
        //   useClass: ServiceInterceptor,
        //   multi: true
        // }
      ]
    });
 
    httpClient = TestBed.get(HttpClient);
    service = TestBed.get(HttpService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  // it('should be created', () => {
  //   const interceptor: ServiceInterceptor = TestBed.inject(ServiceInterceptor);
  //   expect(interceptor).toBeTruthy();
  // });

  it('should add an Authorization header', () => {
    service.GET('/users/2', {}, 'getResult').subscribe(
      (resp :any) => { 
        expect(resp).toBeTruthy();
    });
  
    const httpRequest = httpTestingController.expectOne(service.baseUrl + '/users/2');
  
    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    expect(httpRequest.request.headers.get('Content-Type')).toBeDefined();
    expect(httpRequest.request.headers.get("Accept")).toBeDefined();
    expect(httpRequest.request.headers.get("Authorization")).toBeDefined();
    expect(httpRequest.request.headers.get("Authorization")).toEqual('auth-token');
    httpRequest.flush([]);
  });


  // it("should log a message when an API is called and set the authorization header", () => {
  //   service.GET('/users/2', 'getResult').subscribe(
  //     (resp :any) => { 
  //       expect(resp).toBeTruthy();
  //   });
   
  //   const httpRequest = httpTestingController.expectOne(service.baseUrl + '/users/2');
  //   //expect(window.console.log).toHaveBeenCalled();
  //   expect(window.console.log).toHaveBeenCalledWith(
  //     "Calling API: api/users/2"
  //   );
  //   httpRequest.flush([]);
  // });

  // it("should log an error message when the API call fails ", () => {
  //   httpClient.get('api/travellers').subscribe();
   
  //   let req = httpTestingController.expectOne("api/travellers");
  //   req.error([null], { status: 404 });

  //   expect(window.console.log).toHaveBeenCalled();
  //   expect(window.console.log).toHaveBeenCalledWith(
  //     "Calling API: api/users/2 failed with status 404"
  //   );
  // });

});
