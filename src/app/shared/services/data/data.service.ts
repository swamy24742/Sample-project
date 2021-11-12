import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  // Observable sources
  private modalSubject = new Subject<any>();
  private userSubject = new Subject<any>();
  private logOutSubject = new Subject<any>();
  private loaderSubject = new Subject<any>();

  // Observable  streams
  modalActions$ = this.modalSubject.asObservable();
  userAuth$ = this.userSubject.asObservable();
  userLogOut$ = this.logOutSubject.asObservable();
  loaderState$ = this.loaderSubject.asObservable();

  sendMessage(message: any, messageType: string) {
    switch (messageType) {
      case 'treatyModalActions':
      case 'deleteTreaty':
      case 'tagClaims':
      case 'userModalActions':
        this.modalSubject.next({ message });
        break;
      case 'triggerLogOut':
        this.logOutSubject.next({ message });
        break;
      case 'userSession':
        this.userSubject.next({ message });
        break;
      case 'handleLoader':
        this.loaderSubject.next({ message });
        break;
    }
  }

  clearMessage() {
    //this.subject.next();
  }
}
