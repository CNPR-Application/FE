import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guest-dashboard',
  templateUrl: './guest-dashboard.component.html',
  styleUrls: ['./guest-dashboard.component.scss'],
})
export class GuestDashboardComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  login() {
    this.router.navigateByUrl('/login');
  }
}
