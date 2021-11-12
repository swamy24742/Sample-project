import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('onSearch should emit', () => {
    const fixture = TestBed.createComponent(SearchComponent);
    const component = fixture.componentInstance;
    spyOn(component.onSearch, 'emit');
    component.subscribeToSearch();
    component.searchFilter.setValue('1');
    expect(component.onSearch.emit).toHaveBeenCalled();
  })
  it('toggle filte should turn on showfilter', () => {
    const fixture = TestBed.createComponent(SearchComponent);
    const component = fixture.componentInstance;
    component.showFilter = false;
    component.toggleFilter();
    expect(component.showFilter).toBeTruthy();
  });

  //commented
  // it('reset model sould reset formData', () => {
  //   const fixture = TestBed.createComponent(SearchComponent);
  //   const component = fixture.componentInstance;

  //   component.searchForm.setValue({
  //     "borisId":0,
  //     "tradingPartner": "7",
  //     "cededNo": "BC16",
  //     "riAgency": "326",
  //     "calculatedBy": "B",
  //     "agreementType": "1-Fronted ART",
  //     "treatyName": "ABC_XCFG",
  //     "treatyEffectiveDate": "2014-05-08T12:35:29",
  //     "treatyExpirationDate": "2022-05-08T12:35:29"
  //   });

  //   component.resetModal();
  //   expect(component.searchForm.dirty).toBeFalsy();
  // })






  // it('onFocus event', () => {
  //   const fixture = TestBed.createComponent(SearchComponent);
  //   const component = fixture.componentInstance;
  //   const searchInput = fixture.debugElement.query(By.css('.cb-search'));
  //   let native: HTMLElement = searchInput.nativeElement;
  //   spyOn(component,'onFocusEvent');
  //   fixture.whenStable().then(()=>{
  //     expect(component.onFocusEvent).toHaveBeenCalled();
  //   });
  // })
});
