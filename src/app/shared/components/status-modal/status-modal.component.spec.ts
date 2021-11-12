import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusModalComponent } from './status-modal.component';

describe('StatusModalComponent', () => {
  let component: StatusModalComponent;
  let fixture: ComponentFixture<StatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusModalComponent);
    component = fixture.componentInstance;
    component.modalConfig = {
      status: 'success',
      modalSubject: 'addTreaty'
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
