import { Component, OnInit } from '@angular/core';
import { LoginResponse } from '../interfaces/Account';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss'],
})
export class TeacherDashboardComponent implements OnInit {
  constructor(private localStorage: LocalStorageService) {}

  url?: string;
  name?: string;

  ngOnInit(): void {
    let user: LoginResponse = this.localStorage.get('user');
    this.url = user.image;
    this.name = user.name;
  }
}
