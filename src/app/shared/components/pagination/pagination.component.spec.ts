import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 it('shouls call emit',()=>{
   const fixture = TestBed.createComponent(PaginationComponent);
   const component = fixture.componentInstance;
   spyOn(component.pageChanged,'emit');

   component.pageChange();
   expect(component.pageChanged.emit).toHaveBeenCalled();
 })
  // it('pagination should work', () => {
  //   component.page = 1;
  //   component.pageSize = 6;
  //   component.collectionSize = 60;
  //   component.maxSize = 60;
  //   fixture.detectChanges
  //   const ngbPagination: NgbPagination = fixture.debugElement.nativeElement.querySelector;
  //   let i = 1;

  //   while (ngbPagination.hasNext()) {
  //     component.page = i++;
  //   }
  //   expect(i).toEqual(10);
  // })
});
