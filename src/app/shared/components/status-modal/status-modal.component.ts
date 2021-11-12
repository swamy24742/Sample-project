import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../services';

export interface IModalConfig {
  status: string,
  modalSubject: string
}

@Component({
  selector: 'app-status-modal',
  templateUrl: './status-modal.component.html',
  styleUrls: ['./status-modal.component.scss']
})
export class StatusModalComponent {

  @Input() modalConfig!: IModalConfig;
  confirmModalLabels = {
    'title': '',
    'msg': '',
    'icon': '',
  }

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.setStatusText();
  }

  setStatusText() {
    switch (this.modalConfig.modalSubject) {
      case 'addTreaty':
        if (this.modalConfig.status === 'success') {
          this.confirmModalLabels.msg = "Details have been saved successfully.";
          this.confirmModalLabels.icon = "Tick";
          this.confirmModalLabels.title = "Great!";
        } else {
          this.setGenericError();
        }
        break;
      case 'updateTreaty':
        if (this.modalConfig.status === 'success') {
          this.confirmModalLabels.msg = "Details have been updated successfully.";
          this.confirmModalLabels.icon = "Tick";
          this.confirmModalLabels.title = "Great!";
        } else {
          this.setGenericError();
        }
        break;
      case 'deleteTreaty':
        if (this.modalConfig.status === 'success') {
          this.confirmModalLabels.msg = "Item has been deleted successfully.";
          this.confirmModalLabels.icon = "Tick";
          this.confirmModalLabels.title = "Deleted Successfully";
        } else {
          this.setGenericError();
        }
        break;
      case 'addUser':
        if(this.modalConfig.status === 'success'){
          this.confirmModalLabels.msg ="Details have been saved successfully.";
          this.confirmModalLabels.icon= "Tick";
          this.confirmModalLabels.title= "Great!";
        }else{
          this.setGenericError();
        }
        break;
      case 'updateUser':
        if(this.modalConfig.status === 'success'){
          this.confirmModalLabels.msg ="Details have been updated successfully.";
          this.confirmModalLabels.icon= "Tick";
          this.confirmModalLabels.title= "Great!";
        }else{
          this.setGenericError();
        }
        break;
      case 'tagClaims':
        if (this.modalConfig.status === 'success') {
          this.confirmModalLabels.msg = "Treaties has been tagged successfully.";
          this.confirmModalLabels.icon = "Tick";
          this.confirmModalLabels.title = "Great!";
        } else {
          this.setGenericError();
        }
        break;
      case 'untagClaims':
        if (this.modalConfig.status === 'success') {
          this.confirmModalLabels.msg = "Treaties has been untagged successfully.";
          this.confirmModalLabels.icon = "Tick";
          this.confirmModalLabels.title = "Great!";
        } else {
          this.setGenericError();
        }
        break;
      case 'authError':
        this.confirmModalLabels.msg = "You dont have access to view this application. Please contact your administartor";
        this.confirmModalLabels.icon = "Error";
        this.confirmModalLabels.title = "Failed";
        break;
      case 'invalidPermission':
        this.confirmModalLabels.msg = "You dont have valid permission to perform this operation. Please contact your administartor";
        this.confirmModalLabels.icon = "Error";
        this.confirmModalLabels.title = "Failed";
        break;
      default:
        this.setGenericError();
        break;
    }
  }

  setGenericError() {
    this.confirmModalLabels.msg = "Something went wrong. Please try again later.";
    this.confirmModalLabels.icon = "Error";
    this.confirmModalLabels.title = "Failed";
  }

}
