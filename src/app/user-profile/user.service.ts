import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpService } from '../shared/services';
import { UserCategoryResponse } from './models/user-category';
import { UserProfile } from './models/user-profile';
import { UserProfileListResponse, UserProfileResponse } from './models/user-profile-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private apiService: HttpService) { }

  getUsers(query: any): Observable<UserProfileListResponse> {
    let urlString = '/user';
    return this.apiService.GET(urlString, query, 'getUsers');
    // return of(this.userProfileListResponse);
  }

  getUserCategories(): Observable<UserCategoryResponse> {
    let urlString = '/user/category';
    return this.apiService.GET(urlString, null, 'getUserCategories');
  }

  getUserDetail(userId: string): Observable<UserProfileResponse> {
    let urlString = '/user/' + userId;
    return this.apiService.GET(urlString, null, 'getUserDetail');
  }

  createUser(data: any): Observable<any> {
    let urlString = '/user';
    return this.apiService.POST(urlString, data, 'createUser');
  }

  updateUser(data: any): Observable<any> {
    let urlString = '/user';
    return this.apiService.PUT(urlString, data, 'updateUser');
  }

  deleteUser(query: any): Observable<any> {
    let urlString = '/user';
    return this.apiService.DELETE(urlString, query, 'deleteUser');
  }

}
