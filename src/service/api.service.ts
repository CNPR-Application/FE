import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import {
  RoomArrayResponse,
  RoomCreateRequest,
  RoomList,
  RoomResponse,
} from 'src/interfaces/Room';
import {
  AdminStatisticArray,
  ManagerStatistic,
} from 'src/interfaces/Statistic';
import {
  StudentArrayResponse,
  StudentArraySearchResponse,
} from 'src/interfaces/Student';
import {
  ChangePasswordRequest,
  CreateInFoResponse,
  GetByRoleResponseArray,
  Guest,
  GuestArray,
  ImageRequest,
  ImageResponse,
  InfoArray,
  LoginRequest,
  LoginResponse,
} from '../interfaces/Account';
import {
  AttendanceEditRequest,
  AttendanceList,
  AttendanceReopenRequest,
} from '../interfaces/Attendance';
import { Booking, BookingArray } from '../interfaces/Booking';
import { Branch, BranchArray } from '../interfaces/Branch';
import {
  ClassActivationRequest,
  ClassArray,
  ClassDeleteRequest,
  ClassEditRequest,
  ClassRequest,
  ClassResponse,
  ClassStatus,
  ClassSuspendRequest,
} from '../interfaces/Class';
import {
  CurriculumResponse,
  CurriculumResponseArray,
} from '../interfaces/Curriculum';
import { FeedbackListResponse } from '../interfaces/Feedback';
import {
  NotiBranchRequest,
  NotiClassRequest,
  NotificationListResponse,
  NotiGroupRequest,
  NotiPersonRequest,
  NotiPutRequest,
} from '../interfaces/Notification';
import {
  ScheduleListResponse,
  ScheduleTeacherListResponse,
} from '../interfaces/Schedule';
import { SessionList, SessionRequest } from '../interfaces/Session';
import { Shift, ShiftArray } from '../interfaces/Shift';
import {
  StudentInClassArray,
  StudentInClassListResponse,
} from '../interfaces/StudentInClass';
import {
  Subject,
  SubjectArray,
  SubjectDetail,
  SubjectDetailArray,
  SubjectTeacherArray,
} from '../interfaces/Subject';
import {
  SubjectInTeacher,
  TeacherArray,
  TeacherSearchArray,
  TeachingSubjectRequest,
} from '../interfaces/Teacher';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  rootUrl: string = 'https://lcss-fa21.herokuapp.com/';
  //rootUrl: string = 'http://localhost:8080/';
  headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Content-Type', 'application/json; charset=utf-8')
    .set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,PUT,OPTIONS')
    .set('Access-Control-Allow-Credentials', 'true')
    .set(
      'Access-Control-Allow-Headers',
      'Origin, Content-Type, X-Auth-Token, Authorization'
    );

  //login
  checkLogin(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      this.rootUrl + 'login',
      JSON.stringify(loginRequest),
      { headers: this.headers }
    );
  }

  //curriculum
  getCurriculumByName(
    name: string,
    isAvailable: boolean,
    pageNo: number,
    pageSize: number
  ): Observable<CurriculumResponse> {
    const url = `${this.rootUrl}curriculums?name=${name}&isAvailable=${isAvailable}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<CurriculumResponse>(url, { headers: this.headers });
  }

  getCurriculumDetail(
    curriculumId: number
  ): Observable<CurriculumResponseArray> {
    const url = `${this.rootUrl}curriculums/${curriculumId}`;
    return this.http.get<CurriculumResponseArray>(url, {
      headers: this.headers,
    });
  }

  deleteCurriculum(curriculumId: number): Observable<boolean> {
    const url = `${this.rootUrl}curriculums/${curriculumId}`;
    return this.http.delete<boolean>(url, { headers: this.headers });
  }

  editCurriculum(request: CurriculumResponseArray): Observable<boolean> {
    const url = `${this.rootUrl}curriculums/${request.curriculumId}`;
    return this.http.put<boolean>(url, request, { headers: this.headers });
  }

  createCurriculum(request: CurriculumResponseArray): Observable<boolean> {
    const url = `${this.rootUrl}curriculums`;
    return this.http.post<boolean>(url, request, { headers: this.headers });
  }

  //branch
  getBranchByName(
    name: string,
    pageNo: number,
    pageSize: number,
    isAvailable: boolean
  ): Observable<BranchArray> {
    const url = `${this.rootUrl}admin/branches?name=${name}&isAvailable=${isAvailable}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<BranchArray>(url, { headers: this.headers });
  }

  getBranchDetail(branchId: number): Observable<Branch> {
    const url = `${this.rootUrl}admin/branches/${branchId}`;
    return this.http.get<Branch>(url, { headers: this.headers });
  }

  deleteBranch(branchId: number): Observable<boolean> {
    const url = `${this.rootUrl}admin/branches/${branchId}`;
    return this.http.delete<boolean>(url, { headers: this.headers });
  }

  editBranch(request: Branch): Observable<boolean> {
    const url = `${this.rootUrl}admin/branches/${request.branchId}`;
    return this.http.put<boolean>(url, request, { headers: this.headers });
  }

  createBranch(request: Branch): Observable<boolean> {
    const url = `${this.rootUrl}admin/branches`;
    return this.http.post<boolean>(url, request, { headers: this.headers });
  }

  //subject
  getSubjectByName(
    name: string,
    isAvailable: boolean,
    pageNo: number,
    pageSize: number
  ): Observable<SubjectArray> {
    const url = `${this.rootUrl}subjects?name=${name}&isAvailable=${isAvailable}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<SubjectArray>(url, { headers: this.headers });
  }

  getSubjectByCurriculumId(
    curriculumId: number,
    isAvailable: boolean,
    pageNo: number,
    pageSize: number
  ): Observable<SubjectArray> {
    const url = `${this.rootUrl}subjects?curriculumId=${curriculumId}&isAvailable=${isAvailable}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<SubjectArray>(url, { headers: this.headers });
  }

  getSubjectOfTeacher(
    teacherUsername: string,
    pageNo: number,
    pageSize: number
  ): Observable<SubjectTeacherArray> {
    const url = `${this.rootUrl}subjects?teacherUsername=${teacherUsername}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<SubjectTeacherArray>(url, { headers: this.headers });
  }

  getSubjectDetail(subjectId: number): Observable<Subject> {
    const url = `${this.rootUrl}subjects/${subjectId}`;
    return this.http.get<Subject>(url, { headers: this.headers });
  }

  createSubject(request: Subject): Observable<boolean> {
    const url = `${this.rootUrl}subjects`;
    return this.http.post<boolean>(url, request, { headers: this.headers });
  }

  updateSubject(request: Subject): Observable<boolean> {
    const url = `${this.rootUrl}subjects/${request.subjectId}`;
    return this.http.put<boolean>(url, request, { headers: this.headers });
  }

  deleteSubject(subjectId: number): Observable<boolean> {
    const url = `${this.rootUrl}subjects/${subjectId}`;
    return this.http.delete<boolean>(url, { headers: this.headers });
  }

  //subject detail
  getSubjectDetailBySubjectId(
    subjectId: number,
    isAvailable: boolean,
    pageNo: number,
    pageSize: number
  ): Observable<SubjectDetailArray> {
    const url = `${this.rootUrl}subjects/details?subjectId=${subjectId}&isAvailable=${isAvailable}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<SubjectDetailArray>(url, { headers: this.headers });
  }

  deleteSubjectDetail(subjectDetailId: number): Observable<boolean> {
    const url = `${this.rootUrl}subjects/details/${subjectDetailId}`;
    return this.http.delete<boolean>(url, { headers: this.headers });
  }

  createSubjectDetail(request: SubjectDetail): Observable<boolean> {
    const url = `${this.rootUrl}subjects/details`;
    return this.http.post<boolean>(url, request, { headers: this.headers });
  }

  updateSubjectDetail(request: SubjectDetail): Observable<boolean> {
    const url = `${this.rootUrl}subjects/details/${request.subjectDetailId}`;
    return this.http.put<boolean>(url, request, { headers: this.headers });
  }

  //shift
  getAllShift(
    pageNo: number,
    pageSize: number,
    isAvailable: boolean
  ): Observable<ShiftArray> {
    const url = `${this.rootUrl}shifts?isAvailable=${isAvailable}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<ShiftArray>(url, { headers: this.headers });
  }

  createShift(request: Shift): Observable<boolean> {
    const url = `${this.rootUrl}shifts`;
    return this.http.post<boolean>(url, request, { headers: this.headers });
  }

  getShiftDetailById(shiftId: number): Observable<Shift> {
    const url = `${this.rootUrl}shifts/${shiftId}`;
    return this.http.get<Shift>(url, { headers: this.headers });
  }

  deleteShift(shiftId: number): Observable<boolean> {
    const url = `${this.rootUrl}shifts/${shiftId}`;
    return this.http.delete<boolean>(url, { headers: this.headers });
  }

  recoverShift(shiftId: number): Observable<boolean> {
    const url = `${this.rootUrl}shifts/${shiftId}`;
    return this.http.put<boolean>(url, { headers: this.headers });
  }

  //info
  editInfo(request: LoginResponse): Observable<boolean> {
    const url = `${this.rootUrl}accounts?username=${request.username}`;
    return this.http.put<boolean>(url, request, { headers: this.headers });
  }

  searchInfoByUsername(
    role: string,
    username: string,
    isAvailable: boolean,
    pageNo: number,
    pageSize: number
  ): Observable<InfoArray> {
    const url = `${this.rootUrl}accounts?role=${role}&username=${username}&isAvailable=${isAvailable}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<InfoArray>(url, { headers: this.headers });
  }

  searchInfoByName(
    role: string,
    name: string,
    isAvailable: boolean,
    pageNo: number,
    pageSize: number
  ): Observable<InfoArray> {
    const url = `${this.rootUrl}account?role=${role}&name=${name}&isAvailable=${isAvailable}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<InfoArray>(url, { headers: this.headers });
  }

  deleteAccount(username: string): Observable<boolean> {
    const url = `${this.rootUrl}accounts?username=${username}`;
    return this.http.delete<boolean>(url, { headers: this.headers });
  }

  createInfo(request: LoginResponse): Observable<CreateInFoResponse> {
    const url = `${this.rootUrl}accounts`;
    return this.http.post<CreateInFoResponse>(url, request, {
      headers: this.headers,
    });
  }

  searchInfoByRoleBranchIsAvail(
    role: string,
    branchId: number,
    isAvailable: boolean
  ): Observable<GetByRoleResponseArray> {
    const url = `${this.rootUrl}accounts-by-role?branchId=${branchId}&role=${role}&isAvailable=${isAvailable}`;
    return this.http.get<GetByRoleResponseArray>(url, {
      headers: this.headers,
    });
  }

  //image
  uploadImage(request: ImageRequest, id: string): Observable<ImageResponse> {
    const url = `${this.rootUrl}image?id=${id}`;
    return this.http
      .post<ImageResponse>(url, request, { headers: this.headers })
      .pipe(retry(2));
  }

  updateRole(request: string, username: string): Observable<boolean> {
    const url = `${this.rootUrl}admin/role?username=${username}`;
    return this.http
      .put<boolean>(url, request, { headers: this.headers })
      .pipe(retry(2));
  }

  //class
  createClass(request: ClassRequest): Observable<ClassResponse> {
    const url = `${this.rootUrl}classes`;
    return this.http.post<ClassResponse>(url, request, {
      headers: this.headers,
    });
  }

  getClassByBranch(
    branchId: number,
    status: string,
    pageNo: number,
    pageSize: number
  ): Observable<ClassArray> {
    const url = `${this.rootUrl}classes?branchId=${branchId}&status=${status}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<ClassArray>(url, { headers: this.headers });
  }

  getClassDetail(classId: number): Observable<ClassResponse> {
    const url = `${this.rootUrl}classes/${classId}`;
    return this.http.get<ClassResponse>(url, { headers: this.headers });
  }

  searchClassBySubjectAndShift(
    branchId: number,
    subjectId: number,
    shiftId: number,
    status: string,
    pageNo: number,
    pageSize: number
  ): Observable<ClassArray> {
    const url = `${this.rootUrl}classes/${branchId}/filter?subjectId=${subjectId}&shiftId=${shiftId}&status=${status}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<ClassArray>(url, { headers: this.headers });
  }

  searchClassByTeacherUsernameAndStatus(
    teacherUsername: string,
    status: string,
    pageNo: number,
    pageSize: number
  ): Observable<ClassArray> {
    const url = `${this.rootUrl}teacher-class/${teacherUsername}?status=${status}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<ClassArray>(url, { headers: this.headers });
  }

  searchClassByStudentUsernameAndStatus(
    studentUsername: string,
    status: string,
    pageNo: number,
    pageSize: number
  ): Observable<ClassArray> {
    const url = `${this.rootUrl}student-class/${studentUsername}?status=${status}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<ClassArray>(url, { headers: this.headers });
  }

  searchClassToSuspend(
    status: string,
    price: number,
    branchId: number
  ): Observable<ClassResponse[]> {
    const url = `${this.rootUrl}class-suspend?status=${status}&price=${price}&branchId=${branchId}`;
    return this.http.get<ClassResponse[]>(url, { headers: this.headers });
  }

  activateClass(request: ClassActivationRequest): Observable<number> {
    const url = `${this.rootUrl}activate-class`;
    return this.http.post<number>(url, request, { headers: this.headers });
  }

  getClassStatistic(branchId: number): Observable<ClassStatus> {
    const url = `${this.rootUrl}classes-status?branchId=${branchId}`;
    return this.http.get<ClassStatus>(url, { headers: this.headers });
  }

  getTeacherClassStatistic(teacherUsername: string): Observable<ClassStatus> {
    const url = `${this.rootUrl}classes-status?teacherUsername=${teacherUsername}`;
    return this.http.get<ClassStatus>(url, { headers: this.headers });
  }

  editClass(classId: number, request: ClassEditRequest): Observable<boolean> {
    const url = `${this.rootUrl}classes/${classId}`;
    return this.http.put<boolean>(url, request, { headers: this.headers });
  }

  deleteClass(request: ClassDeleteRequest): Observable<boolean> {
    const url = `${this.rootUrl}classes/${request.classId}`;
    return this.http.patch<boolean>(url, request, { headers: this.headers });
  }

  suspendClass(
    studentInClassId: number,
    request: ClassSuspendRequest
  ): Observable<boolean> {
    const url = `${this.rootUrl}class-suspend?studentInClassId=${studentInClassId}`;
    return this.http.put<boolean>(url, request, { headers: this.headers });
  }

  searchSuspendedClassOfStudent(studentUsername: string):Observable<ClassResponse[]> {
    const url = `${this.rootUrl}class-suspend?studentUsername=${studentUsername}`;
    return this.http.get<ClassResponse[]>(url, { headers: this.headers });
  }

  //student in class
  getStudentInClass(
    classId: number,
    pageNo: number,
    pageSize: number
  ): Observable<StudentInClassArray> {
    const url = `${this.rootUrl}student-in-class?classId=${classId}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<StudentInClassArray>(url, { headers: this.headers });
  }

  moveStudentInClass(
    classId: number,
    bookingIdArray: Array<number>
  ): Observable<boolean> {
    const url = `${this.rootUrl}move-student-in-class?classId=${classId}`;
    return this.http.put<boolean>(url, bookingIdArray, {
      headers: this.headers,
    });
  }

  getAllStudentInClass(classId: number, pageNo: number, pageSize: number) {
    const url = `${this.rootUrl}student-in-class?classId=${classId}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<StudentInClassListResponse>(url, {
      headers: this.headers,
    });
  }

  //guest
  createGuest(request: Guest): Observable<boolean> {
    const url = `${this.rootUrl}guests`;
    return this.http.post<boolean>(url, request, { headers: this.headers });
  }

  searchGuestByNamePhone(
    branchId: number,
    name: string,
    phone: string,
    curriculumName: string,
    pageNo: number,
    pageSize: number
  ): Observable<GuestArray> {
    const url = `${this.rootUrl}guests/?branchId=${branchId}&name=${name}&phone=${phone}&curriculumName=${curriculumName}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<GuestArray>(url, { headers: this.headers });
  }

  searchGuestByStatus(
    branchId: number,
    status: string,
    pageNo: number,
    pageSize: number
  ): Observable<GuestArray> {
    const url = `${this.rootUrl}guests/?branchId=${branchId}&status=${status}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<GuestArray>(url, { headers: this.headers });
  }

  updateGuest(request: Guest): Observable<boolean> {
    const url = `${this.rootUrl}guests/${request.id}`;
    return this.http
      .put<boolean>(url, request, { headers: this.headers })
      .pipe(retry(2));
  }

  //booking
  createBooking(request: Booking): Observable<boolean> {
    const url = `${this.rootUrl}bookings`;
    return this.http.post<boolean>(url, request, { headers: this.headers });
  }

  searchBookingByStudentUsername(
    studentUsername: string,
    pageNo: number,
    pageSize: number
  ): Observable<BookingArray> {
    const url = `${this.rootUrl}bookings?studentUsername=${studentUsername}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<BookingArray>(url, { headers: this.headers });
  }

  searchBookingByClassIdAndStatus(
    classId: number,
    status: string,
    pageNo: number,
    pageSize: number
  ): Observable<BookingArray> {
    const url = `${this.rootUrl}bookings?classId=${classId}&status=${status}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<BookingArray>(url, { headers: this.headers });
  }

  updateBooking(booking: Booking): Observable<boolean> {
    const url = `${this.rootUrl}bookings?bookingId=${booking.bookingId}`;
    return this.http.put<boolean>(url, booking, { headers: this.headers });
  }

  //teacher

  searchTeacherByBranchSubject(
    branchId: number,
    subjectId: number,
    pageNo: number,
    pageSize: number
  ): Observable<TeacherArray> {
    const url = `${this.rootUrl}teachers?branchId=${branchId}&subjectId=${subjectId}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<TeacherArray>(url, { headers: this.headers });
  }

  searchTeacherByBranchNamePhone(
    branchId: number,
    isAvailable: boolean,
    phone: string,
    name: string,
    pageNo: number,
    pageSize: number
  ): Observable<TeacherSearchArray> {
    const url = `${this.rootUrl}teachers-in-branch?branchId=${branchId}&isAvailable=${isAvailable}&phone=${phone}&name=${name}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<TeacherSearchArray>(url, { headers: this.headers });
  }

  searchTeacherByBranchIsAvail(
    branchId: number,
    isAvailable: boolean,
    pageNo: number,
    pageSize: number
  ): Observable<TeacherArray> {
    const url = `${this.rootUrl}teachers?branchId=${branchId}&isAvailable=${isAvailable}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<TeacherArray>(url, { headers: this.headers });
  }

  searchAvailTeacherForClass(
    branchId: number,
    shiftId: number,
    openingDate: string,
    subjectId: number
  ): Observable<TeacherSearchArray> {
    const url = `${this.rootUrl}teachers/${branchId}/search?shiftId=${shiftId}&openingDate=${openingDate}&subjectId=${subjectId}`;
    return this.http.get<TeacherSearchArray>(url, { headers: this.headers });
  }

  deleteTeacher(username: string): Observable<boolean> {
    const url = `${this.rootUrl}teachers/${username}`;
    return this.http.delete<boolean>(url, { headers: this.headers });
  }

  //schedule
  getSchedule(
    branchId: number,
    date: string
  ): Observable<ScheduleListResponse> {
    const url = `${this.rootUrl}schedules?date=${date}&branchId=${branchId}`;
    return this.http.get<ScheduleListResponse>(url, { headers: this.headers });
  }

  getTeacherSchedule(
    teacherUsername: string,
    date: string
  ): Observable<ScheduleTeacherListResponse> {
    const url = `${this.rootUrl}schedules?teacherUsername=${teacherUsername}&srchDate=${date}`;
    return this.http.get<ScheduleTeacherListResponse>(url, {
      headers: this.headers,
    });
  }

  //session view of a class
  getSessionInClass(
    classId: number,
    pageNo: number,
    pageSize: number
  ): Observable<SessionList> {
    const url = `${this.rootUrl}session?classId=${classId}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<SessionList>(url, { headers: this.headers });
  }

  updateSession(request: SessionRequest): Observable<boolean> {
    const url = `${this.rootUrl}sessions`;
    return this.http.put<boolean>(url, request, { headers: this.headers });
  }

  //attendance
  viewAttendanceInSession(
    sessionId: number,
    pageNo: number,
    pageSize: number
  ): Observable<AttendanceList> {
    const url = `${this.rootUrl}attendance/teacher/${sessionId}/?pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<AttendanceList>(url, { headers: this.headers });
  }

  editAttendance(
    attendanceList: Array<AttendanceEditRequest>
  ): Observable<boolean> {
    const url = `${this.rootUrl}attendance`;
    return this.http.put<boolean>(url, attendanceList, {
      headers: this.headers,
    });
  }

  reopenAttendance(request: AttendanceReopenRequest) {
    const url = `${this.rootUrl}reopen-attendance`;
    return this.http.put<boolean>(url, request, { headers: this.headers });
  }

  //feedback
  getFeedbackByClassId(
    classId: number,
    pageNo: number,
    pageSize: number
  ): Observable<FeedbackListResponse> {
    const url = `${this.rootUrl}feedback/${classId}/?pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<FeedbackListResponse>(url, { headers: this.headers });
  }

  //notification
  getAllNotification(
    username: string,
    pageNo: number,
    pageSize: number
  ): Observable<NotificationListResponse> {
    const url = `${this.rootUrl}notification/${username}?pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<NotificationListResponse>(url, {
      headers: this.headers,
    });
  }

  createNotiForClass(request: NotiClassRequest): Observable<boolean> {
    const url = `${this.rootUrl}notification-in-class`;
    return this.http.post<boolean>(url, request, { headers: this.headers });
  }

  createNotiForBranch(request: NotiBranchRequest): Observable<boolean> {
    const url = `${this.rootUrl}notification-to-all`;
    return this.http.post<boolean>(url, request, { headers: this.headers });
  }

  createNotiForPerson(request: NotiPersonRequest): Observable<boolean> {
    const url = `${this.rootUrl}notification-to-person`;
    return this.http.post<boolean>(url, request, { headers: this.headers });
  }

  createNotiForGroup(request: NotiGroupRequest): Observable<boolean> {
    const url = `${this.rootUrl}notification-to-group`;
    return this.http.post<boolean>(url, request, { headers: this.headers });
  }

  editNotification(
    request: NotiPutRequest,
    notificationId: number
  ): Observable<boolean> {
    const url = `${this.rootUrl}notification/${notificationId}`;
    return this.http.put<boolean>(url, request, { headers: this.headers });
  }

  //room
  getRoomByBranchShiftOpeningDate(
    branchId: number,
    shiftId: number,
    openingDate: string,
    classId: number
  ): Observable<RoomList> {
    const url = `${this.rootUrl}rooms/${branchId}/search?shiftId=${shiftId}&openingDate=${openingDate}&classId=${classId}`;
    return this.http.get<RoomList>(url, { headers: this.headers });
  }

  getRoomByBranchIsAvailable(
    branchId: number,
    isAvailable: boolean,
    pageNo: number,
    pageSize: number
  ): Observable<RoomArrayResponse> {
    const url = `${this.rootUrl}rooms/${branchId}?isAvailable=${isAvailable}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<RoomArrayResponse>(url, { headers: this.headers });
  }

  editRoom(request: RoomResponse): Observable<boolean> {
    const url = `${this.rootUrl}rooms`;
    return this.http.put<boolean>(url, request, { headers: this.headers });
  }

  createRoom(request: RoomCreateRequest): Observable<boolean> {
    const url = `${this.rootUrl}rooms`;
    return this.http.post<boolean>(url, request, { headers: this.headers });
  }

  deleteRoom(roomId: number): Observable<boolean> {
    const url = `${this.rootUrl}rooms?roomId=${roomId}`;
    return this.http.delete<boolean>(url, { headers: this.headers });
  }

  //student
  getStudentInBranch(
    branchId: number,
    isAvailable: boolean,
    pageNo: number,
    pageSize: number
  ): Observable<StudentArrayResponse> {
    const url = `${this.rootUrl}student?branchId=${branchId}&isAvailable=${isAvailable}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<StudentArrayResponse>(url, { headers: this.headers });
  }

  searchStudentByBranchNamePhone(
    branchId: number,
    isAvailable: boolean,
    phone: string,
    name: string,
    pageNo: number,
    pageSize: number
  ): Observable<StudentArraySearchResponse> {
    const url = `${this.rootUrl}students?branchId=${branchId}&isAvailable=${isAvailable}&phone=${phone}&name=${name}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http.get<StudentArraySearchResponse>(url, {
      headers: this.headers,
    });
  }

  deleteStudent(username: string): Observable<boolean> {
    const url = `${this.rootUrl}students/${username}`;
    return this.http.delete<boolean>(url, { headers: this.headers });
  }

  //teaching subject
  searchTeachingSubjectByTeacherUsername(
    teacherUsername: string
  ): Observable<SubjectInTeacher[]> {
    const url = `${this.rootUrl}teaching-subjects?teacherUsername=${teacherUsername}`;
    return this.http.get<SubjectInTeacher[]>(url, { headers: this.headers });
  }

  deleteTeachingSubject(request: TeachingSubjectRequest): Observable<boolean> {
    const url = `${this.rootUrl}teaching-subjects/${request.teacherUsername}/${request.subjectId}`;
    return this.http.delete<boolean>(url, { headers: this.headers });
  }

  createTeachingSubject(request: TeachingSubjectRequest): Observable<boolean> {
    const url = `${this.rootUrl}teaching-subjects`;
    return this.http.post<boolean>(url, request, { headers: this.headers });
  }

  //password
  forgotPassword(username: string): Observable<boolean> {
    const url = `${this.rootUrl}forgot-password?username=${username}`;
    return this.http.put<boolean>(url, { headers: this.headers });
  }

  changePassword(
    request: ChangePasswordRequest,
    username: string
  ): Observable<boolean> {
    const url = `${this.rootUrl}accounts-change-password?username=${username}`;
    return this.http.put<boolean>(url, request, { headers: this.headers });
  }

  //statistic
  getManagerStatistic(
    date: string,
    branchId: number
  ): Observable<ManagerStatistic> {
    const url = `${this.rootUrl}manager-statistic?date=${date}&branchId=${branchId}`;
    return this.http.get<ManagerStatistic>(url, { headers: this.headers });
  }

  getAdminStatistic(date: string): Observable<AdminStatisticArray> {
    const url = `${this.rootUrl}admin-statistic?date=${date}`;
    return this.http.get<AdminStatisticArray>(url, { headers: this.headers });
  }
}
