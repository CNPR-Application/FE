import { Component, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationResponse } from 'src/interfaces/Notification';
import { ApiService } from 'src/service/api.service';
import { AuthenticationService } from 'src/service/authentication.service';
import { MessagingService } from 'src/service/messaging.service';
import { LoginResponse } from '../../interfaces/Account';
import { LocalStorageService } from '../../service/local-storage.service';
import { NotificationDialogComponent } from '../manager-dashboard/notification-dialog/notification-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private localStorage: LocalStorageService,
    private api: ApiService,
    private dialog: MatDialog,
    private messagingService: MessagingService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe((x) => {
      if (x != null) this.currentUser = x;
    });
  }

  url?: string;
  name?: string;
  username?: string;
  showNotification: boolean = false;

  //notification
  notiArray?: Array<NotificationResponse>;
  unreadNoti: number = 0;
  message: any;

  currentUser?: LoginResponse;

  ngOnInit(): void {
    let user: LoginResponse = this.localStorage.get('user');
    this.url = user.image;
    this.name = user.name;
    this.username = user.username;
    this.messagingService.requestPermission();
    this.messagingService.receiveMessage();
    this.messagingService.notiUpdated.subscribe((data) => {
      console.log('new message received. ', data);
      this.getNotification();
    });
    this.getNotification();
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  openNotification(state: boolean) {
    this.showNotification = state;
  }

  openDialog(type: string, noti?: NotificationResponse): void {
    // one, array
    let dialogRef = this.dialog.open(NotificationDialogComponent, {
      data: {
        type: type,
        username: this.username,
        array: this.notiArray,
        noti: noti,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getNotification();
    });
  }

  getNotification() {
    if (this.username) {
      this.api.getAllNotification(this.username, 1, 20).subscribe(
        (response) => {
          this.notiArray = response.notificationList;
          this.unreadNoti = 0;
          this.notiArray?.forEach((x) => {
            if (!x.isRead) {
              this.unreadNoti++;
            }
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
