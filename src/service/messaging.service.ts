import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  notiUpdated = this.currentMessage.asObservable();
  constructor(
    private angularFireMessaging: AngularFireMessaging,
  ) {
    this.angularFireMessaging.messages.subscribe(
      (m: AngularFireMessaging | any) => {
        m.onMessage = m.onMessage.bind(m);
        m.onTokenRefresh = m.onTokenRefresh.bind(m);
      }
    );
  }

  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log('token : ' + token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload: AngularFireMessaging | any) => {
        this.currentMessage.next(payload);
      }
    );
  }
}
