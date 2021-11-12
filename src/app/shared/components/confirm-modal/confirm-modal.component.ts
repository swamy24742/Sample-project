import { Component, OnInit, Input } from '@angular/core';
import { DataService, CommonService } from '../../services';

export interface IModalConfig {
  action: string,
  isEditMode: boolean,
  modalData: any,
  modalSubject: string
}

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit{

  @Input() modalConfig!: IModalConfig;
  confirmModalLabels = {
    'title': '',
    'msg': '',
    'confirmTxt': '',
    'cancelTxt': 'Cancel'
  }
  constructor(private dataService: DataService, private commonService:CommonService) {}

  ngOnInit(): void {
    this.setConfirmText();
  }

  closeModal(){
    this.commonService.closeConfirmModal();
  }

  handleStatusModal(action: any) {
    if(this.modalConfig.modalSubject === "logOut"){
      if(action === 'proceed'){
        this.dataService.sendMessage('trigger-log-out', 'triggerLogOut');
      }else{
        this.dataService.sendMessage('cancel-log-out', 'triggerLogOut');
      }
    }else{
      this.modalConfig.action = action;
      this.dataService.sendMessage({
        modalDetails: this.modalConfig
      }, this.modalConfig.modalSubject);
    }
    //this.activeModal.close(this.treatyForm.value);
  }

  setConfirmText(){
    switch(this.modalConfig.modalSubject){
      case 'treatyModalActions':
        if(!this.modalConfig.isEditMode){
          this.confirmModalLabels.msg ="Are you sure you want to add a new Treaty ?";
          this.confirmModalLabels.confirmTxt= "Add";
          this.confirmModalLabels.title= "Add New Treaty";
        }else{
          this.confirmModalLabels.msg ="Are you sure you want to update Treaty ?";
          this.confirmModalLabels.confirmTxt= "Update";
          this.confirmModalLabels.title= "Update Treaty";
        }
        break;
      case 'deleteTreaty':
          this.confirmModalLabels.msg ="Are you sure you want to delete this Treaty ?";
          this.confirmModalLabels.confirmTxt= "Delete";
          this.confirmModalLabels.title= "Delete Treaty";
        break;
      case 'userModalActions':
        if (!this.modalConfig.isEditMode) {
          this.confirmModalLabels.msg = "Are you sure you want to add a new User ?";
          this.confirmModalLabels.confirmTxt = "Add";
          this.confirmModalLabels.title = "Add New User";
        } else {
          this.confirmModalLabels.msg = "Are you sure you want to update User ?";
          this.confirmModalLabels.confirmTxt = "Update";
          this.confirmModalLabels.title = "Update User";
        }
        break;
      case 'tagClaims':
        if(this.modalConfig.isEditMode){
          this.confirmModalLabels.msg ="Are you sure you want to untag all treaties against this claim ?";
        }else{
          this.confirmModalLabels.msg ="Are you sure you want to tag these treaties to these claim(s) ?";
        }
          this.confirmModalLabels.confirmTxt= "Confirm";
          this.confirmModalLabels.title= "Tag Treaty";
        break;
      case 'logOut':
          this.confirmModalLabels.msg ="Are you sure you want to logout from this application?";
          this.confirmModalLabels.confirmTxt= "Logout";
          this.confirmModalLabels.title= "Log Out";
        break;
    }
  }

}
