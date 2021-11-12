import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../shared/services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private route: Router, private authService: AuthService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     console.log(route.data.page);
      if (this.authService.isUserLoggedIn()) {
        return this.handleRouting(route.data.page);
      } else {
        if (this.authService.validateUserData()) {
          return this.handleRouting(route.data.page);
        } else {
          this.authService.getLoginUrl().subscribe(res=>{
            window.location.href = res.Result.redirectUrl;
            return true;
          });
          // this.route.navigate(['/oauth-redirect']);
          return false;
        }
      }
  }

  handleRouting(page:string):boolean {
    let accessDetails = this.authService.getUserData().accessDetails;
    let data = this.authService.getSessionData();
    let toTime = new Date(data.toTime).getTime();
    //let toTime = new Date("11/9/2021 9:12:49 AM").getTime();
    var now = new Date();
    let currentTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000).getTime();
    if(currentTime < toTime){ 
      if(page !== 'dashboard'){
        if(accessDetails[page] !== 'N/A'){
          return true;
        }else{
          this.route.navigate(['/page-access-error']);
          return false
        }
      }else{
        return true;
      }
    }else{
      this.authService.logout();
      this.route.navigate(['/session-expired']);
      return false;
    }
  }
  
}
