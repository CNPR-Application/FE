import { Component, OnInit } from '@angular/core';
import { LoginResponse } from 'src/interfaces/Account';
import { LocalStorageService } from 'src/service/local-storage.service';

@Component({
  selector: 'app-manager-menu',
  templateUrl: './manager-menu.component.html',
  styleUrls: ['./manager-menu.component.scss'],
})
export class ManagerMenuComponent implements OnInit {
  constructor(private localStorage: LocalStorageService) {}

  role?: string;

  ngOnInit(): void {
    let user: LoginResponse = this.localStorage.get('user');
    this.role = user.role;
  }
}
