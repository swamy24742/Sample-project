import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { DataService } from '../data/data.service';
import { SecureLocalStorageService } from '../local-storage/secure-local-storage.service';

export interface IAuthConfig {
  loggedIn: boolean,
  userData: any,
  sessionData: any,
  authToken: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userConfig: IAuthConfig;

  constructor(private apiService : HttpService, private dataService: DataService, private localStorageService: SecureLocalStorageService) { 
    this.userConfig = {
      loggedIn: false,
      userData: {},
      sessionData: {},
      authToken: ''
    }
  }

  validateUserData() {
    if (this.localStorageService.getItem('userConfig')) {
      let userData: any = this.localStorageService.getItem('userConfig');
      this.setUserData(JSON.parse(userData));
      return true;
    } else {
      return false;
    }
  }

  setUserAuthConfigData(data: any) {
    this.localStorageService.setItem('userConfig', JSON.stringify(data));
    this.setUserData(data);
  }

  isUserLoggedIn(){
    return this.userConfig.loggedIn;
  }

  logout() {
    // remove user from local storage and set current user to null
    this.localStorageService.removeItem('userConfig');
    this.userConfig.loggedIn = false;
    this.userConfig.userData = null;
    this.userConfig.sessionData = null;
    this.userConfig.authToken = '';
    this.dataService.sendMessage('logged-out', 'userSession');
  }

  public setUserData(data: any) {
    this.userConfig.loggedIn = true;
    this.userConfig.userData = data.userData;
    this.userConfig.sessionData = data.sessionData;
    this.userConfig.authToken = data.authToken;
    this.dataService.sendMessage(data.userData, 'userSession');
  }

  getUserData(){
    return this.userConfig.userData;
  }

  getSessionData(){
    return this.userConfig.sessionData;
  }

  getUserToken(){
    return this.userConfig.authToken;
  }

  setAuthTokenInitially(token:any){
    this.userConfig.authToken = token;
  }

  getUserAccess(userId:string): Observable<any> {
    let urlString = '/user/'+userId+'/access';
    return this.apiService.GET(urlString, {}, 'getUserAccess');
  }

  getUserDetails(userId:string): Observable<any> {
    let urlString = '/user/'+userId;
    return this.apiService.GET(urlString, {}, 'getUserDetails');
  }

  getLoginUrl(){
    let urlString = '/auth/login';
    return this.apiService.GET(urlString, '','getLoginUrl');
  }

  refreshUserSession(){
    this.logout();
    this.getLoginUrl().subscribe(res=>{
      window.location.href = res.Result.redirectUrl;
    });
  }

}
