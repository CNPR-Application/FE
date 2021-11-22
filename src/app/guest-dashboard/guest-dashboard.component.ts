import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/service/authentication.service';

@Component({
  selector: 'app-guest-dashboard',
  templateUrl: './guest-dashboard.component.html',
  styleUrls: ['./guest-dashboard.component.scss'],
})
export class GuestDashboardComponent implements OnInit {
  constructor(private router: Router, private authenticatedService: AuthenticationService) {
    authenticatedService.logout();
  }

  ngOnInit(): void {}

  login() {
    this.router.navigateByUrl('/login');
  }
}
