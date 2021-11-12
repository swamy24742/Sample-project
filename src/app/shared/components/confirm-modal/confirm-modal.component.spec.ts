import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModalComponent } from './confirm-modal.component';
import { DataService } from '../../services';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmModalComponent],
      providers: [
        DataService
        // {
        //     provide: DataService,
        //     useValue: {
        //         getUser: () => ({ name: 'Test' })
        //     }
        // }
    ],
      //schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    component.modalConfig = {
      action: '',
      isEditMode: false,
      modalData: {},
      modalSubject: ''
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // it('confirmModalLabels should not have any other values before ngOnInit', () => {
  //   fixture.detectChanges();  // runs initial lifecycle hooks

  //   expect(component.confirmModalLabels).toBe({
  //   'title': '',
  //   'msg': '',
  //   'confirmTxt': '',
  //   'cancelTxt': 'Cancel'}, 'should not have any default values');
  // });

  it('should set modal labels for treaty labels add mode', () => {
    // Arrange
    component.modalConfig = {
      'modalSubject': 'treatyModalActions',
      'action': '',
      'isEditMode': false,
      'modalData': {}
    }
    component.confirmModalLabels = {
      'title': '',
      'msg': '',
      'confirmTxt': '',
      'cancelTxt': 'Cancel'
    }
    const title = fixture.debugElement.nativeElement.querySelector('.cb-head-title');
    const msg = fixture.debugElement.nativeElement.querySelector('.cb-confirm-txt');

    // Act
    component.setConfirmText();
    fixture.detectChanges();

    // Assert
    expect(component.confirmModalLabels.title).toEqual('Add New Treaty');
    expect(component.confirmModalLabels.msg).toEqual('Are you sure you want to add a new Treaty ?');
    expect(component.confirmModalLabels.confirmTxt).toEqual('Add');
    expect(msg).toBeTruthy();
    expect(title).toBeTruthy();
    expect(component.confirmModalLabels.title).toEqual(title.textContent);
    expect(component.confirmModalLabels.msg).toEqual(msg.textContent);
  });

  it('should set modal labels treaty modal edit mode', () => {
    // Arrange
    component.modalConfig = {
      'modalSubject': 'treatyModalActions',
      'action': '',
      'isEditMode': true,
      'modalData': {}
    }
    component.confirmModalLabels = {
      'title': '',
      'msg': '',
      'confirmTxt': '',
      'cancelTxt': 'Cancel'
    }
    const title = fixture.debugElement.nativeElement.querySelector('.cb-head-title');
    const msg = fixture.debugElement.nativeElement.querySelector('.cb-confirm-txt');

    // Act
    component.setConfirmText();
    fixture.detectChanges();

    // Assert
    expect(component.confirmModalLabels.title).toEqual('Update Treaty');
    expect(component.confirmModalLabels.msg).toEqual('Are you sure you want to update Treaty ?');
    expect(component.confirmModalLabels.confirmTxt).toEqual('Update');
    expect(msg).toBeTruthy();
    expect(title).toBeTruthy();
    expect(component.confirmModalLabels.title).toEqual(title.textContent);
    expect(component.confirmModalLabels.msg).toEqual(msg.textContent);
  });

  it('should handle status as passed on handleStatusModal', () => {
    // Arrange
    component.modalConfig = {
      'modalSubject': 'treatyModalActions',
      'action': '',
      'isEditMode': true,
      'modalData': {}
    }
    // Act
    component.handleStatusModal('proceed');
    // Assert
    expect(component.modalConfig.action).toEqual('proceed');
});


  // it('should set modal labels', () => {
  //   const fixture = TestBed.createComponent(ConfirmModalComponent);
  //   // fixture.detectChanges();
  //   // const compiled = fixture.debugElement.nativeElement;
  //   // expect(compiled.querySelector('.modal-title').textContent).toContain(component.confirmModalLabels.title);

  //   // const title = fixture.debugElement.nativeElement.querySelector('.modal-title');
  //   // fixture.detectChanges();
  //   // expect(title).toBeTruthy();
  //   // expect(component.confirmModalLabels.title).toEqual(title.innnerHTML);
  // });

});
