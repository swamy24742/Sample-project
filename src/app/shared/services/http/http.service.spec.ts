import { TestBed } from '@angular/core/testing';
import { APP_CONFIG, AppConfig } from '../../../app.config';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { HttpService } from './http.service';
import { enums } from '../../../enumerations/enum';
import { AppConstants } from '../../../enumerations/app-constants';
import { environment } from '../../../../environments/environment';

describe('HttpService', () => {
  let service: HttpService;
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        HttpClient,
        // { provide: APP_CONFIG, useValue: AppConfig }
        {
          provide: APP_CONFIG, useValue: {
            appCredentials: environment.appCredentials,
            appConstants: AppConstants.labels,
            enums: enums,
          }
        }
      ]
    });
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.inject(HttpService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  // it('GET() should call http Get method for the given route', () => {

  //   //Arrange
  //   //Set Up Data 
  //   let response = {
  //     "data": {
  //       "id": 2,
  //       "email": "janet.weaver@reqres.in",
  //       "first_name": "Janet",
  //       "last_name": "Weaver",
  //       "avatar": "https://reqres.in/img/faces/2-image.jpg"
  //     },
  //     "support": {}
  //   }

  //   //Act
  //   service.GET('/users/2', 'getResult').subscribe((emp) => {
  //     //Assert-1
  //     expect(emp).toEqual(response);

  //   });

  //   //Assert -2
  //   const req = httpTestingController.expectOne(service.baseUrl + '/users/2');
  //   expect(req.request.method).toEqual("GET");
  //   req.flush(response);

  //   //Assert -3
  //   httpTestingController.verify();

  // });

  describe('#GET', () => {
    let response: any;

    beforeEach(() => {
      service = TestBed.inject(HttpService);
      response = {
        "data": {
          "id": 2,
          "email": "janet.weaver@reqres.in",
          "first_name": "Janet",
          "last_name": "Weaver",
          "avatar": "https://reqres.in/img/faces/2-image.jpg"
        },
        "support": {}
      };
    });

    it('should return expected result (called once)', () => {

      service.GET('/users/2', {}, 'getResult').subscribe(
        resp => expect(resp).toEqual(response),
        fail
      );

      // HeroService should have made one request to GET heroes from expected URL
      const req = httpTestingController.expectOne(service.baseUrl + '/users/2');
      expect(req.request.method).toEqual('GET');

      // Respond with the mock heroes
      req.flush(response);
    });

    it('should be OK returning no result', () => {

      service.GET('/users/23', {}, 'getResult').subscribe(
        resp => expect(resp).toEqual([]),
        fail
      );

      const req = httpTestingController.expectOne(service.baseUrl + '/users/23');
      req.flush([]); // Respond with no heroes
    });

    // // This service reports the error but finds a way to let the app keep going.
    // it('should turn 404 into an empty heroes result', () => {

    //   service.GET('/users/23', 'getResult').subscribe(
    //     resp => expect(resp).toEqual({}),
    //     fail
    //   );

    //   const req = httpTestingController.expectOne(service.baseUrl + '/users/23');

    //   // respond with a 404 and the error message in the body
    //   const msg = 'deliberate 404 error';
    //   req.flush(msg, { status: 404, statusText: 'Not Found' });
    // });
  });


  it("should call POST API", () => {
    let reqObj = {
      "name": "morpheus",
      "job": "leader"
    };
    let respObj = {
      "name": "morpheus",
      "job": "leader",
      "id": "221",
      "createdAt": "2021-09-30T08:19:24.697Z"
    };
    service.POST('/users', reqObj, 'postData').subscribe(
      resp => expect(resp).toEqual(respObj),
      fail
    );

    const req = httpTestingController.expectOne(service.baseUrl + '/users');
    expect(req.request.method).toEqual("POST");
    expect(req.request.body).toEqual(reqObj);

  });

  it("should call PUT API", () => {
    let reqObj = {
      "name": "morpheus",
      "job": "zion resident"
    };
    let respObj = {
      "name": "morpheus",
      "job": "zion resident",
      "updatedAt": "2021-09-30T10:30:17.358Z"
    };
    service.PUT('/users/2', reqObj, 'putData').subscribe(
      resp => expect(resp).toEqual(respObj),
      fail
    );

    const req = httpTestingController.expectOne(service.baseUrl + '/users/2');
    expect(req.request.method).toEqual("PUT");
    expect(req.request.body).toEqual(reqObj);

  });

  it('DELETE() should call http DELETE method for the given route', () => {

    //Arrange
    //Set Up Data 

    //Act
    service.DELETE('/users/2', {}, 'deleteResult').subscribe((emp) => {
      //Assert-1
      //expect(emp).toEqual(response);

    });

    //Assert -2
    const req = httpTestingController.expectOne(service.baseUrl + '/users/2');
    expect(req.request.method).toEqual("DELETE");
    req.flush([]);

    //Assert -3
    httpTestingController.verify();

  });

});
