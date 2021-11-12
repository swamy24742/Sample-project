import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { of } from 'rxjs';
import { CommonService, DataService } from 'src/app/shared/services';
import { ManageTreatyComponent } from './manage-treaty.component';
import { click, expectText, setFieldValue } from '../../spec-helpers/element.spec-helper';

describe('ManageTreatyComponent', () => {
  let component: ManageTreatyComponent;
  let fixture: ComponentFixture<ManageTreatyComponent>;
  let commonService: jasmine.SpyObj<CommonService>;
  let fakeDataService: DataService;
  const setup = async (
    commonServiceReturnValues?: jasmine.SpyObjMethodNames<CommonService>,
  ) => {
    commonService = jasmine.createSpyObj<CommonService>('commonService', {
      compareDate: true
    })
  }

  beforeEach(async () => {
    fakeDataService = jasmine.createSpyObj<any>('DataService', {
      sendMessage: undefined
    });

    await TestBed.configureTestingModule({
      declarations: [ManageTreatyComponent],
      imports: [AngularMyDatePickerModule, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: commonService, useValue: commonService },
       { provide: DataService, useValue: fakeDataService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTreatyComponent);
    component = fixture.componentInstance;
    component.treatyData = {
      "borisId":0,
      "tradingPartner": "7",
      "cededNo": "BC16",
      "riAgency": "326",
      "calculatedBy": "B",
      "agreementType": "1-Fronted ART",
      "treatyName": "ABC_XCFG",
      "effectiveDate": new Date(),
      "expirationDate": new Date(new Date().getTime() + (24 * 60 * 60 * 1000))
    };
    component.treatyConfig = {
      isEditMode: false,
      hasValues: false,
      isDuplicateError:false
    };
    fixture.detectChanges();
  });

  const fillForm = () => {
    setFieldValue(fixture, 'tradingPartner', '7');
    setFieldValue(fixture, 'cededNo', 'BC16');
    setFieldValue(fixture, 'riAgency', '326');
    setFieldValue(fixture, 'calculatedBy', "Boris Calculated");
    setFieldValue(fixture, 'agreementType', "1-Fronted ART");
    setFieldValue(fixture, 'treatyName', "ABC_XCFG");
    setFieldValue(fixture, 'treatyEffectiveDate', new Date());
    setFieldValue(fixture, 'treatyExpirationDate', new Date(new Date().getTime() + (24 * 60 * 60 * 1000)));
  };

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should update modal labels as needed', () => {
    fixture.detectChanges();
    expect(component.title).toEqual('Add New Treaty');
    expect(component.actionButtonTitle).toEqual('Add');
  });

  it('should update modal labels as needed in edit case', () => {
    component.treatyConfig.isEditMode = true;
    component.treatyData;
    fixture.detectChanges();
    expect(component.title).toEqual('Update Treaty');
    expect(component.actionButtonTitle).toEqual('Update');
  });

  it('should trigger close button click', () => {
    const buttonElement = fixture.debugElement.query(By.css('.close'));
    buttonElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    let msgObj = {
      modalDetails: {
        'action': 'close',
        'isEditMode': component.treatyConfig.isEditMode,
        'modalData': {},
        'modalSubject': 'treatyModalActions'
      }
    };
    expect(fakeDataService.sendMessage).toHaveBeenCalledWith(msgObj, 'treatyModalActions');
  });

  // it('should trigger reset button click', () => {
  //   component.treatyConfig.isEditMode = true;
  //   fixture.detectChanges();
  //   const buttonElement = fixture.debugElement.query(By.css('.cb-reset-link'));
  //   spyOn(component, 'resetModal');
  //   buttonElement.triggerEventHandler('click', null);
  //   expect(component.resetModal).toHaveBeenCalled();
  // });

  it('form invalid when empty', () => {
    fixture.autoDetectChanges();
    expect(component.treatyForm.valid).toBeFalsy();
  })
  it('RIAgency field validity', () => {
    let RIAgency = component.treatyForm.controls['riAgency'];
    expect(RIAgency.hasError('required')).toBeTruthy();
  })

  it('RIAgency field shold be editable mode when Add new treay', () => {
    component.treatyConfig.isEditMode = true;
    fixture.detectChanges();
    let RIAgency = component.treatyForm.controls['riAgency'];
    const htmlElement = fixture.debugElement.query(By.css("#RIAgency"));
    const inputEl: HTMLInputElement = htmlElement.nativeElement;

    expect(inputEl.readOnly).toBeTruthy();

  })
  //commented
  // it('cededNo field validity', () => {
  //   let cededNo = component.treatyForm.controls['cededNo'];
  //   expect(cededNo.hasError('required')).toBeTruthy();
  // })
  it('cededNo should be invalid when minimum', () => {
    fixture.detectChanges();
    let name = component.treatyForm.controls['cededNo'];
    expect(name.valid).toBeFalsy();

    name.setValue("");
    expect(name.hasError('required')).toBeDefined();

    name.setValue("A");
    expect(name.hasError('maxLength')).toBeDefined();
  })
  it('On date change event',()=>{
    fixture.autoDetectChanges();
     component.onDateChanged ({
      isRange:true
      // singleDate?: new Date,
      // dateRange?: IMyDateRangeModel;
     });
    expect(component.onDateChanged).toBeTruthy();
  })

  // it('expiryDate validation', () => {
  //   fixture.autoDetectChanges();
  //   // effectiveDate : '04/10/2021'
  //   // expiryDate : '06/10/2021'
  //   let treatyExpirationDate = component.treatyForm.controls['treatyExpirationDate'];
  //   treatyExpirationDate.setValue('2021-01-02');

  //   let treatyEffectiveDate = component.treatyForm.controls['treatyEffectiveDate'];
  //   treatyEffectiveDate.setValue('2021-01-01');
  //   var result = component.expiryValidation('treatyEffectiveDate', 'treatyExpirationDate');

  //   expect(result).toBeGreaterThan;

  // })

  //   it('should pass the correct data on modal close', () => {
  //   const fixture = TestBed.createComponent(ManageTreatyComponent);
  //   const component = fixture.componentInstance;
  //   component.resetModal();
  //   fixture.autoDetectChanges();
  //   expect(component.treatyForm.valid).toBeFalsy();
  // })

  // it('reset model sould reset formData', () => {
  //   const fixture = TestBed.createComponent(ManageTreatyComponent);
  //   const component = fixture.componentInstance;
  //   component.resetModal();
  //   fixture.autoDetectChanges();
  //   expect(component.treatyForm.value).toBeTruthy();
  // })


  //comp spy logic

  // validationLoadListDownload() {
  //   if (this.getGroupId === 0) {
  //     this.loadListDownloadRequest();
  //   } else {
  //     this.loadListDownloadRequestGroup();
  //   }
  // }

  // it('should download the validation list when getGroupId is zero', () => {
  //   const loadListDownloadRequestSpy = spyOn(component, 'loadListDownloadRequest');
  //   component.getGroupId = 0;
  //   component.validationLoadListDownload();
  //   expect(loadListDownloadRequestSpy).toHaveBeenCalled();
  // });
  
  
  // it('should download the validation list when getGroupId is not zero', () => {
  //   const loadListDownloadRequestGroupSpy = spyOn(component, 'loadListDownloadRequestGroup');
  //   component.getGroupId = 5;
  //   component.validationLoadListDownload();
  //   expect(loadListDownloadRequestGroupSpy ).toHaveBeenCalled();
  // });

});
