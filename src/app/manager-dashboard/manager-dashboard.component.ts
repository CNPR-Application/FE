import { Component, OnInit } from '@angular/core';
import { LoginResponse } from '../../interfaces/Account';
import { NotificationResponse } from '../../interfaces/Notification';
import { ApiService } from '../../service/api.service';
import { LocalStorageService } from '../../service/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDialogComponent } from './notification-dialog/notification-dialog.component';
import { MessagingService } from 'src/service/messaging.service';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss'],
})
export class ManagerDashboardComponent implements OnInit {
  constructor(
    private localStorage: LocalStorageService,
    private api: ApiService,
    private dialog: MatDialog,
    private messagingService: MessagingService,
  ) {}

  url?: string;
  name?: string;
  username?: string;
  showNotification: boolean = false;

  //notification
  notiArray?: Array<NotificationResponse>;
  unreadNoti: number = 0;
  message: any;

  ngOnInit(): void {
    let user: LoginResponse = this.localStorage.get('user');
    this.url = user.image;
    this.name = user.name;
    this.username = user.username;
    this.messagingService.requestPermission();
    this.messagingService.receiveMessage();
    this.messagingService.notiUpdated.subscribe((data) => {
      this.getNotification();
    });
    this.getNotification();
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
