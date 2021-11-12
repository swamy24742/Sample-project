import { Component, OnInit } from '@angular/core';
import { DataService, AuthService } from '../../services';
import { Router} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-session-timer',
  templateUrl: './session-timer.component.html',
  styleUrls: ['./session-timer.component.scss']
})
export class SessionTimerComponent implements OnInit {

  sec: number = 60;
  userSession: Subscription;
  showTimer:boolean= false;

  initialInterval:any;
  interval:any;

  constructor(private dataService: DataService, private authService: AuthService, private route: Router) {
    this.userSession = this.dataService.userAuth$.subscribe((data: any) =>{
      if(data.message !== 'logged-out'){
        this.initializeSessionTimer();
      }else{
        this.sec = 60;
        clearInterval(this.initialInterval);
        clearInterval(this.interval);
      }
    });
   }

  ngOnInit(): void {
  }

  initializeSessionTimer(){
    let data = this.authService.getSessionData();
    let toTime = new Date(data.toTime).getTime();
    //let toTime = new Date("11/9/2021 11:23:49 AM").getTime();
    var timeNow = new Date();
    let currentTime = new Date(timeNow.getTime() + timeNow.getTimezoneOffset() * 60000).getTime();
    if(currentTime < toTime){
      this.initialInterval = setInterval(() => {
        //console.log(new Date().toISOString());
        var now = new Date();
        let timeDifference = toTime - (new Date(now.getTime() + now.getTimezoneOffset() * 60000).getTime());
        timeDifference = (timeDifference/1000);
        if (timeDifference <= 80) {
          clearInterval(this.initialInterval);
          if(timeDifference >= 20){
            this.handleTimer();
          }
        }
      }, 1000*20);
    }else{
      //this.postLoggedOffActions();
    }
  }

  handleTimer() {
    this.showTimer = true;
    this.interval = setInterval(() => {
      this.sec--;
      if (this.sec == 0) {
        clearInterval(this.interval)
        setTimeout(() =>  this.postLoggedOffActions(), 4000); 
      }
    }, 1000);
  }

  postLoggedOffActions(){
    this.showTimer = false;
    this.authService.logout();
    this.route.navigate(['/session-expired']);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.userSession.unsubscribe();
  }

}
