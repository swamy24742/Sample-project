import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ListTreatyComponent } from './list-treaty.component';
import { CommonService, DataService } from '../../shared/services';
import { TreatyService } from '../treaty.service';
import { Observable, Subject } from 'rxjs';

describe('ListTreatyComponent', () => {
  let component: ListTreatyComponent;
  let fixture: ComponentFixture<ListTreatyComponent>;
  let mockDataService: any = {
  }
  let mockTreatyService: any = {
    getAgreementType: () => {
      return true
    },
    getTreaty: () => {
      return true
    },
    createTreaty: () => {
      return true
    },
    updateTreaty: () => {
      return true
    },
    deleteTreaty: () => {
      return true
    },
  }
  let mockCommonService: any = {
    setAgreementLists: () => {
      return true
    },
    validateAPIResponse: () => {
      return true
    },
    closeConfirmModal: () => {
      return true
    },
    initiateConfirmModal: () => {
      return true
    },
    initiateStatusModal: () => {
      return true
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListTreatyComponent],
      providers: [
        { provide: CommonService, useValue: mockCommonService },
        { provide: DataService, useValue: mockDataService }, 
        { provide: TreatyService, useValue: mockTreatyService }, 
        ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTreatyComponent);
    component = fixture.componentInstance;
    component.page = 1;
    component.pageSize = 2;
    component.collectionSize = 0;
    // mockDataService.modalActions$.subscribe((message:any) => {
    //   expect(message).toBe('test');
    // })
  
    // mockDataService.callNextOnSubject('test');
    component.treatyMasterList = [
      {
        "borisId":0,
        "tradingPartner": "7",
        "cededNo": "BC16",
        "riAgency": "326",
        "calculatedBy": "B",
        "agreementType": "1-Fronted ART",
        "treatyName": "ABC_XCFG",
        "treatyEffectiveDate": "2014-05-08T12:35:29",
        "treatyExpirationDate": "2022-05-08T12:35:29"
      },
      {
        "borisId":1,
        "tradingPartner": "7",
        "cededNo": "BC16",
        "riAgency": "326",
        "calculatedBy": "B",
        "agreementType": "1-Fronted ART",
        "treatyName": "ABC_XCFG",
        "treatyEffectiveDate": "2014-05-08T12:35:29",
        "treatyExpirationDate": "2022-05-08T12:35:29"
      }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //commented
  // it('should set treatylist as defined for page settings', () => {
  //   // Arrange
  //   let slicedResult = [
  //     {
  //       "borisId":0,
  //       "tradingPartner": "7",
  //       "cededNo": "BC16",
  //       "riAgency": "326",
  //       "calculatedBy": "B",
  //       "agreementType": "1-Fronted ART",
  //       "treatyName": "ABC_XCFG",
  //       "treatyEffectiveDate": "2014-05-08T12:35:29",
  //       "treatyExpirationDate": "2022-05-08T12:35:29"
  //     },
  //     {
  //       "borisId":0,
  //       "tradingPartner": "7",
  //       "cededNo": "BC16",
  //       "riAgency": "326",
  //       "calculatedBy": "B",
  //       "agreementType": "1-Fronted ART",
  //       "treatyName": "ABC_XCFG",
  //       "treatyEffectiveDate": "2014-05-08T12:35:29",
  //       "treatyExpirationDate": "2022-05-08T12:35:29"
  //     }];
  //   // Act
  //   component.handleTreatyList();
  //   // Assert
  //   expect(component.treatyList).toEqual(slicedResult);
  //   expect(component.pageOfDisplay).toEqual('Showing ' + '<b>' + 1 + '</b>' + ' to ' + '<b>' + 2 + '</b>' + ' out of ' + '<b>' + component.treatyMasterList.length + '</b>' + ' entries');
  // });

  //commented
//   it('should populate treatyMasterList', () => {
//     expect(component.treatyMasterList).not.toBeNull();
// })

/**
* Filtering test case
*/
//commented 
// it('filter should filter out 1 item', () => {
//     component.triggerSearch('a');
//     expect(component.treatyList.length).toBeGreaterThan(1);
// })

// it('filter should not filter anything', () => {
//     component.triggerSearch('RANDOM_NAME_ALSKJDLASKJ');
//     expect(component.treatyList.length).toEqual(0);
// })

});
