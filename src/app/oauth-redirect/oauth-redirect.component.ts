import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { AuthService, CommonService } from '../shared/services';

@Component({
  selector: 'app-oauth-redirect',
  templateUrl: './oauth-redirect.component.html',
  styleUrls: ['./oauth-redirect.component.scss']
})
export class OauthRedirectComponent implements OnInit {

  constructor(private route: Router, private actRoute:ActivatedRoute, private authService: AuthService, private commonService:CommonService) { }

  ngOnInit(): void {
    let token = "";
    this.actRoute.queryParams.subscribe(params=>{
      if(params.statuscode == '200'){
        this.authService.setAuthTokenInitially(params.token);
        this.getUserDetails(params.user, params.token, 
          {user: params.user, fromTime : params.fromtime, toTime: params.totime });
      }else{
        if(params.statuscode == '500'){
          this.route.navigate(['/generic-error']);
        }else{
          this.route.navigate(['/access-error']);
        } 
      }
    });
  }

  setAuthData(userData:any, token:string, sessionData:any) {
    let data = {
      userData: userData,
      sessionData: sessionData,
      authToken: token
    }
    this.authService.setUserAuthConfigData(data);
    this.route.navigate(['/dashboard']);
  }

  getUserDetails(username:string, token:string, sessionData:any){
    this.authService.getUserDetails(username)
      .subscribe(res => {
        if(this.commonService.validateAPIResponse(res)){
          this.setAuthData(res.Result, token, sessionData);
        }else{
          this.commonService.initiateStatusModal({
            status: 'error',
            modalSubject: 'genericError'
          });
        }
      }, (err) => {
        this.commonService.initiateStatusModal({
          status: 'error',
          modalSubject: 'genericError'
        });
      });
  }

}
