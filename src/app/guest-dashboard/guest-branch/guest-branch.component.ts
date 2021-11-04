import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Branch, BranchArray } from 'src/interfaces/Branch';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-guest-branch',
  templateUrl: './guest-branch.component.html',
  styleUrls: ['./guest-branch.component.scss'],
})
export class GuestBranchComponent implements OnInit {
  //gg map
  keyBranch?: string;
  src: string =
    'https://maps.google.com/maps?q=ho%20chi%20minh&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=&amp;output=embed';
  safeSrc?: SafeResourceUrl;
  branchArray?: Array<Branch>;
  //loading
  isLoading: boolean = false;
  //paging
  currentPage?: number = 1;
  pageArray?: Array<number>;
  //search
  name: string = '';
  //image
  imageArray: Array<string> = [
    'assets/image/building1.jpg',
    'assets/image/building2.jpg',
    'assets/image/building3.png',
    'assets/image/building4.jpg',
    'assets/image/building5.jpg',
    'assets/image/building6.jpg',
    'assets/image/building7.jpg',
    'assets/image/building8.jpg',
    'assets/image/building9.jpg',
  ];

  constructor(
    private api: ApiService,
    private sanitizer: DomSanitizer,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
    this.getBranchByName();
  }

  searchBranch(search?: string) {
    this.keyBranch = search;
    this.keyBranch?.replace('', '%20');
    this.src =
      'https://maps.google.com/maps?q=' +
      this.keyBranch +
      '&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=&amp;output=embed';
    this.setSafeSource();
    this.viewportScroller.scrollToAnchor('map');
  }

  setSafeSource() {
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }

  getBranchByName() {
    if (this.currentPage)
      this.api.getBranchByName(this.name, this.currentPage, 10, true).subscribe(
        (response: BranchArray) => {
          this.branchArray = response.branchResponseDtos;
          this.pageArray = Array(response.pageTotal)
            .fill(1)
            .map((x, i) => i + 1)
            .reverse();
          this.currentPage = response.pageNo;
          this.isLoading = false;
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
          this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
        }
      );
  }

  changePage(pageNo: number) {
    this.currentPage = pageNo;
    this.getBranchByName();
  }

  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  doYes(): void {
    this.haveAlertYN = false;
  }

  doNo(): void {
    this.haveAlertYN = false;
  }

  callAlert(type: string, message: string, param?: any) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
    }
  }
}
