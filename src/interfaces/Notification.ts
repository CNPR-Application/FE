export interface NotificationListResponse {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  notificationList?: NotificationResponse[];
}

export interface NotificationResponse {
  notificationId?: number;
  senderUsername?: string;
  receiverUsername?: string;
  title?: string;
  body?: string;
  isRead?: boolean;
  creatingDate?: string;
  lastModified?: string;
}

export interface NotiClassRequest {
  classId: number;
  senderUsername: string;
  title: string;
  body: string;
}
export interface NotiBranchRequest {
  branchId: number;
  senderUsername: string;
  title: string;
  body: string;
}
export interface NotiPersonRequest {
  receiverUsername: string;
  senderUsername: string;
  title: string;
  body: string;
}

export interface NotiPutRequest{
  isRead : boolean;
}
