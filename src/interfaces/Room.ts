export interface RoomList {
  roomList: RoomResponse[];
}

export interface RoomResponse {
  roomId: number;
  roomName: string;
  isAvailable?: boolean;
}

export interface RoomCreateRequest {
  branchId: number;
  roomName: string;
}

export interface RoomArrayResponse {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  roomList: RoomResponse[];
}
