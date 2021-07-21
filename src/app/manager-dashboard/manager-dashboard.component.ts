import { Component, OnInit } from '@angular/core';
import { LoginResponse } from '../models/Account';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss'],
})
export class ManagerDashboardComponent implements OnInit {
  constructor(private localStorage: LocalStorageService) {}

  url?: string;
  name?: string;

  ngOnInit(): void {
    let user: LoginResponse = this.localStorage.get('user');
    this.url = user.image;
    this.name = user.name;
  }
}
