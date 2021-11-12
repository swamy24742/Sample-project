import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService, CommonService, DataService } from '../../services';
import { Router} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  userSession: Subscription;
  logOutSub: Subscription;
  userDetails:any ={
    isLoggedIn : false,
    userData: {}
  }

  showLogModal:boolean = false;

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    this.showLogModal = false;
  }

  constructor(private authService: AuthService, private commonService:CommonService, private dataService: DataService, private route: Router) {
    this.userSession = this.dataService.userAuth$.subscribe((data: any) =>{
      if(data.message !== 'logged-out'){
        this.userDetails.isLoggedIn = true;
        this.userDetails.userData = data.message;
      }else{
        this.userDetails.isLoggedIn = false;
        this.userDetails.userData = {};
      }
    });
    this.logOutSub = this.dataService.userLogOut$.subscribe((data: any) =>{
      if(data.message === 'trigger-log-out'){
        this.commonService.closeConfirmModal();
        this.logOutUser();
      }else{
        this.commonService.closeConfirmModal();
      }
    });
   }

   toggleLogModal(){
    this.showLogModal = !this.showLogModal;
   }

   triggerLogOut(){
    let modalDetails = {
      'action': 'logOut',
      'isEditMode': false,
      'modalData': {},
      'modalSubject': 'logOut'
    }
    this.commonService.initiateConfirmModal(modalDetails);
   }

   logOutUser(){
    this.showLogModal = false;
    this.authService.logout();
    this.route.navigate(['/logged-out']);
   }

   ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.userSession.unsubscribe();
    this.logOutSub.unsubscribe();
  }

}
