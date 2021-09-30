import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  NotificationResponse,
  NotiPutRequest,
} from 'src/interfaces/Notification';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-notification-teacher-dialog',
  templateUrl: './notification-teacher-dialog.component.html',
  styleUrls: ['./notification-teacher-dialog.component.scss'],
})
export class NotificationTeacherDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NotificationTeacherDialogComponent>,
    private api: ApiService
  ) {}

  notiArray?: Array<NotificationResponse> = [];
  totalNoti?: number = 0;

  ngOnInit(): void {
    if (this.data.type == 'one') {
      this.notiArray?.push(this.data.noti);
      this.editNotification(this.data.noti);
    } else if (this.data.type == 'array') {
      this.getAllNotification();
    }
  }

  getAllNotification() {
    if (this.data.username) {
      this.api.getAllNotification(this.data.username, 1, 20000000).subscribe(
        (response) => {
          this.notiArray = response.notificationList;
          this.totalNoti = this.notiArray?.length;
          this.notiArray?.forEach((x) => {
            if (!x.isRead) {
              this.editNotification(x);
            }
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  editNotification(noti: NotificationResponse) {
    let request: NotiPutRequest = {
      isRead: true,
    };
    if (noti.notificationId && noti.isRead == false) {
      this.api.editNotification(request, noti.notificationId).subscribe(
        (response) => {
          console.log(
            'Edit noti ' + noti.notificationId + ' result: ' + response
          );
        },
        (error) => {
          console.log('Edit noti ' + noti.notificationId + ' error: ' + error);
        }
      );
    }
  }
}
