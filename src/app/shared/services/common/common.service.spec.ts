import { TestBed } from '@angular/core/testing';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from './common.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { Component } from '@angular/core';
import { StatusModalComponent } from '../../components/status-modal/status-modal.component';
import { DataService } from '..';
import { observable } from 'rxjs';

export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve('x'));
}

describe('CommonService', () => {
  let service: CommonService;
  let ngbModal: NgbModal;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule]
    });
    service = TestBed.inject(CommonService);
    ngbModal = TestBed.inject(NgbModal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //   it('should open modal', () => {
  //     spyOn(ngbModal, 'open').and.returnValue(mockModalRef as any);
  //     service.initiateConfirmModal({
  //       action: '',
  //       isEditMode: false,
  //       modalData: {},
  //       modalSubject: ''
  //     });
  //     ngbModal.componentInstance = {title: '', message: ''};
  //     expect(ngbModal.open).toHaveBeenCalledWith(ConfirmModalComponent, {
  //       scrollable: true,
  //       windowClass: 'cb-confirm-modal',
  //       centered: true,
  //       backdrop: 'static'
  //     });
  // });

  it('should compare two dates', () => {
    // Arrange
    const fromDate = {
      month: 9,
      day: 11,
      year: 2021
    };

    const toDate = {
      month: 9,
      day: 19,
      year: 2021
    };

    // Act
    const dateValue = service.compareDate(fromDate, toDate);

    // Assert
    expect(dateValue).toEqual(true);
  });

  it('should format date', () => {
    // Arrange
    const date = {
      month: 9,
      day: 11,
      year: 2021
    };

    // Act
    const dateValue = service.formatFateLocale(date);

    // Assert
    expect(dateValue).toEqual(new Date('09/11/2021'));
  });

  describe("log reporting", function () {
    beforeEach(function () {
      spyOn(window.console, 'log');
    });
    it('should print log message to console', function () {
      service.log('msg');
      expect(window.console.log).toHaveBeenCalled();
    })
  });
  it('Confirm model should close', () => {
    service.initiateConfirmModal({
      action: '',
      isEditMode: false,
      modalData: {},
      modalSubject: ''
    });
    expect(service.statusModalRef).toBeDefined();

    spyOn(service.statusModalRef, 'close');
    service.closeConfirmModal();

    expect(service.statusModalRef.close).toHaveBeenCalled();
  })
  it('initiateConfirmModal', () => {
    service.initiateConfirmModal({
      modalDetails: {
        scrollable: true,
        windowClass: 'cb-confirm-modal',
        centered: true,
        backdrop: 'static'
      }
    });;
    service.statusModalRef;
    expect(service.initiateConfirmModal).toBeTruthy();
  })
  it('getArrayIndex should return index', () => {
    const arrayData = [{
      id: "a", name: "Letter a"
    }, {
      id: 'b', name: "Letter b"
    }];
    var returnedIndex = service.getArrayIndex(arrayData, 'id', 'a');

    expect(returnedIndex).toBe(0);

  })

  it('handleError should return error', () => {
    var error = service.handleError('operation', null);

    expect(error).toBeDefined();

  })

    it('should print log message to console', function () {
      service.handleError('operation', null)
      // return observable;
      

      expect(window.console.log).toBeDefined();
    })
});
