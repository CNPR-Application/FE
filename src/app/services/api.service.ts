import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import {
  CreateInFoResponse,
  Guest,
  GuestArray,
  ImageRequest,
  ImageResponse,
  InfoArray,
  LoginRequest,
  LoginResponse,
} from '../interfaces/Account';
import { Booking, BookingArray } from '../interfaces/Booking';
import { Branch, BranchArray } from '../interfaces/Branch';
import {
  ClassActivationRequest,
  ClassArray,
  ClassRequest,
  ClassResponse,
  ClassStatus,
  StudentInClassArray,
} from '../interfaces/Class';
import {
  CurriculumResponse,
  CurriculumResponseArray,
} from '../interfaces/Curriculum';
import { ScheduleListResponse } from '../interfaces/Schedule';
import { Shift, ShiftArray } from '../interfaces/Shift';
import { StudentInClassListResponse } from '../interfaces/StudentInClass';
import {
  Subject,
  SubjectArray,
  SubjectDetail,
  SubjectDetailArray,
} from '../interfaces/Subject';
import { TeacherArray } from '../interfaces/Teacher';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  rootUrl: string = 'https://lcss-fa21.herokuapp.com/';
  headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Content-Type', 'application/json; charset=utf-8')
    .set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,PUT,OPTIONS')
    .set('Access-Control-Allow-Credentials', 'true')
    .set(
      'Access-Control-Allow-Headers',
      'Origin, Content-Type, X-Auth-Token, content-type'
    );

  //login
  checkLogin(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        this.rootUrl + 'login',
        JSON.stringify(loginRequest),
        { headers: this.headers }
      )
      .pipe(retry(1));
  }

  //curriculum
  getCurriculumByName(
    name: string,
    isAvailable: boolean,
    pageNo: number,
    pageSize: number
  ): Observable<CurriculumResponse> {
    const url = `${this.rootUrl}curriculums?name=${name}&isAvailable=${isAvailable}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http
      .get<CurriculumResponse>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  getCurriculumDetail(
    curriculumId: number
  ): Observable<CurriculumResponseArray> {
    const url = `${this.rootUrl}curriculums/${curriculumId}`;
    return this.http
      .get<CurriculumResponseArray>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  deleteCurriculum(curriculumId: number): Observable<boolean> {
    const url = `${this.rootUrl}curriculums/${curriculumId}`;
    return this.http
      .delete<boolean>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  editCurriculum(request: CurriculumResponseArray): Observable<boolean> {
    const url = `${this.rootUrl}curriculums/${request.curriculumId}`;
    return this.http
      .put<boolean>(url, request, { headers: this.headers })
      .pipe(retry(1));
  }

  createCurriculum(request: CurriculumResponseArray): Observable<boolean> {
    const url = `${this.rootUrl}curriculums`;
    return this.http
      .post<boolean>(url, request, { headers: this.headers })
      .pipe(retry(1));
  }

  //branch
  getBranchByName(
    name: string,
    pageNo: number,
    pageSize: number,
    isAvailable: boolean
  ): Observable<BranchArray> {
    const url = `${this.rootUrl}admin/branches?name=${name}&isAvailable=${isAvailable}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http
      .get<BranchArray>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  getBranchDetail(branchId: number): Observable<Branch> {
    const url = `${this.rootUrl}admin/branches/${branchId}`;
    return this.http.get<Branch>(url, { headers: this.headers }).pipe(retry(1));
  }

  deleteBranch(branchId: number): Observable<boolean> {
    const url = `${this.rootUrl}admin/branches/${branchId}`;
    return this.http
      .delete<boolean>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  editBranch(request: Branch): Observable<boolean> {
    const url = `${this.rootUrl}admin/branches/${request.branchId}`;
    return this.http
      .put<boolean>(url, request, { headers: this.headers })
      .pipe(retry(1));
  }

  createBranch(request: Branch): Observable<boolean> {
    const url = `${this.rootUrl}admin/branches`;
    return this.http
      .post<boolean>(url, request, { headers: this.headers })
      .pipe(retry(1));
  }

  //subject
  getSubjectByName(
    name: string,
    isAvailable: boolean,
    pageNo: number,
    pageSize: number
  ): Observable<SubjectArray> {
    const url = `${this.rootUrl}subjects?name=${name}&isAvailable=${isAvailable}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http
      .get<SubjectArray>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  getSubjectByCurriculumId(
    curriculumId: number,
    isAvailable: boolean,
    pageNo: number,
    pageSize: number
  ): Observable<SubjectArray> {
    const url = `${this.rootUrl}subjects?curriculumId=${curriculumId}&isAvailable=${isAvailable}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http
      .get<SubjectArray>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  getSubjectDetail(subjectId: number): Observable<Subject> {
    const url = `${this.rootUrl}subjects/${subjectId}`;
    return this.http
      .get<Subject>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  createSubject(request: Subject): Observable<boolean> {
    const url = `${this.rootUrl}subjects`;
    return this.http
      .post<boolean>(url, request, { headers: this.headers })
      .pipe(retry(1));
  }

  updateSubject(request: Subject): Observable<boolean> {
    const url = `${this.rootUrl}subjects/${request.subjectId}`;
    return this.http
      .put<boolean>(url, request, { headers: this.headers })
      .pipe(retry(1));
  }

  deleteSubject(subjectId: number): Observable<boolean> {
    const url = `${this.rootUrl}subjects/${subjectId}`;
    return this.http
      .delete<boolean>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  //subject detail
  getSubjectDetailBySubjectId(
    subjectId: number,
    isAvailable: boolean,
    pageNo: number,
    pageSize: number
  ): Observable<SubjectDetailArray> {
    const url = `${this.rootUrl}subjects/details?subjectId=${subjectId}&isAvailable=${isAvailable}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http
      .get<SubjectDetailArray>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  deleteSubjectDetail(subjectDetailId: number): Observable<boolean> {
    const url = `${this.rootUrl}subjects/details/${subjectDetailId}`;
    return this.http
      .delete<boolean>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  createSubjectDetail(request: SubjectDetail): Observable<boolean> {
    const url = `${this.rootUrl}subjects/details`;
    return this.http
      .post<boolean>(url, request, { headers: this.headers })
      .pipe(retry(1));
  }

  updateSubjectDetail(request: SubjectDetail): Observable<boolean> {
    const url = `${this.rootUrl}subjects/details/${request.subjectDetailId}`;
    return this.http
      .put<boolean>(url, request, { headers: this.headers })
      .pipe(retry(1));
  }

  //shift
  getAllShift(
    pageNo: number,
    pageSize: number,
    isAvailable: boolean
  ): Observable<ShiftArray> {
    const url = `${this.rootUrl}shifts?isAvailable=${isAvailable}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http
      .get<ShiftArray>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  createShift(request: Shift): Observable<boolean> {
    const url = `${this.rootUrl}shifts`;
    return this.http
      .post<boolean>(url, request, { headers: this.headers })
      .pipe(retry(1));
  }

  getShiftDetailById(shiftId: number): Observable<Shift> {
    const url = `${this.rootUrl}shifts/${shiftId}`;
    return this.http.get<Shift>(url, { headers: this.headers }).pipe(retry(1));
  }

  deleteShift(shiftId: number): Observable<boolean> {
    const url = `${this.rootUrl}shifts/${shiftId}`;
    return this.http
      .delete<boolean>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  recoverShift(shiftId: number): Observable<boolean> {
    const url = `${this.rootUrl}shifts/${shiftId}`;
    return this.http
      .put<boolean>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  //info
  editInfo(request: LoginResponse): Observable<boolean> {
    const url = `${this.rootUrl}accounts?username=${request.username}`;
    return this.http
      .put<boolean>(url, request, { headers: this.headers })
      .pipe(retry(1));
  }

  searchInfoByUsername(
    role: string,
    username: string,
    isAvailable: boolean,
    pageNo: number,
    pageSize: number
  ): Observable<InfoArray> {
    const url = `${this.rootUrl}accounts?role=${role}&username=${username}&isAvailable=${isAvailable}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http
      .get<InfoArray>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  searchInfoByName(
    role: string,
    name: string,
    isAvailable: boolean,
    pageNo: number,
    pageSize: number
  ): Observable<InfoArray> {
    const url = `${this.rootUrl}accounts?role=${role}&name=${name}&isAvailable=${isAvailable}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http
      .get<InfoArray>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  deleteAccount(username: string): Observable<boolean> {
    const url = `${this.rootUrl}accounts?username=${username}`;
    return this.http
      .delete<boolean>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  createInfo(request: LoginResponse): Observable<CreateInFoResponse> {
    const url = `${this.rootUrl}accounts`;
    return this.http
      .post<CreateInFoResponse>(url, request, { headers: this.headers })
      .pipe(retry(1));
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
    return this.http
      .post<ClassResponse>(url, request, { headers: this.headers })
      .pipe(retry(1));
  }

  getClassByBranch(
    branchId: number,
    status: string,
    pageNo: number,
    pageSize: number
  ): Observable<ClassArray> {
    const url = `${this.rootUrl}classes?branchId=${branchId}&status=${status}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http
      .get<ClassArray>(url, { headers: this.headers })
      .pipe(retry(1));
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
    return this.http
      .get<ClassArray>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  activateClass(request: ClassActivationRequest): Observable<boolean> {
    const url = `${this.rootUrl}activate-class`;
    return this.http.post<boolean>(url, request, { headers: this.headers });
  }

  getClassStatistic(branchId: number): Observable<ClassStatus> {
    const url = `${this.rootUrl}classes-status?branchId=${branchId}`;
    return this.http
      .get<ClassStatus>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  //student in class
  getStudentInClass(
    classId: number,
    pageNo: number,
    pageSize: number
  ): Observable<StudentInClassArray> {
    const url = `${this.rootUrl}student-in-class?classId=${classId}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http
      .get<StudentInClassArray>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  moveStudentInClass(
    classId: number,
    bookingIdArray: Array<number>
  ): Observable<boolean> {
    const url = `${this.rootUrl}move-student-in-class?classId=${classId}`;
    return this.http
      .put<boolean>(url, bookingIdArray, { headers: this.headers })
      .pipe(retry(1));
  }

  //guest
  createGuest(request: Guest): Observable<boolean> {
    const url = `${this.rootUrl}guests`;
    return this.http
      .post<boolean>(url, request, { headers: this.headers })
      .pipe(retry(1));
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
    return this.http
      .get<GuestArray>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  searchGuestByStatus(
    branchId: number,
    status: string,
    pageNo: number,
    pageSize: number
  ): Observable<GuestArray> {
    const url = `${this.rootUrl}guests/?branchId=${branchId}&status=${status}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http
      .get<GuestArray>(url, { headers: this.headers })
      .pipe(retry(1));
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
    return this.http
      .post<boolean>(url, request, { headers: this.headers })
      .pipe(retry(1));
  }

  searchBookingByStudentId(
    studentId: string,
    pageNo: number,
    pageSize: number
  ): Observable<BookingArray> {
    const url = `${this.rootUrl}bookings?studentId=${studentId}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http
      .get<BookingArray>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  //teacher

  searchTeacher(
    branchId: number,
    subjectId: number,
    pageNo: number,
    pageSize: number
  ): Observable<TeacherArray> {
    const url = `${this.rootUrl}teachers?branchId=${branchId}&subjectId=${subjectId}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http
      .get<TeacherArray>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  //schedule
  getSchedule(date: string) {
    const url = `${this.rootUrl}schedules?date=${date}`;
    return this.http
      .get<ScheduleListResponse>(url, { headers: this.headers })
      .pipe(retry(1));
  }

  //student in class
  getAllStudentInClass(classId: number, pageNo: number, pageSize: number) {
    const url = `${this.rootUrl}student-in-class?classId=${classId}&pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.http
      .get<StudentInClassListResponse>(url, { headers: this.headers })
      .pipe(retry(1));
  }
}
