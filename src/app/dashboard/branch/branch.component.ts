import { Component, OnInit } from '@angular/core';
import { Branch, BranchArray } from 'src/app/interfaces/Branch';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { BranchDialogComponent } from './branch-dialog/branch-dialog.component';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
})
export class BranchComponent implements OnInit {
  branchResponse?: BranchArray;
  branchArray?: Array<Branch>;

  constructor(private api: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getBranchByName('', 1, true);
  }
  //loading
  isLoading: boolean = false;
  //search
  keyBranch: string = '';
  //paging
  totalPage?: number;
  currentPage?: number;
  pageArray?: Array<number>;
  //clickId
  clickedId: number = 0;
  //for search
  isAvailable: boolean = true;

  searchBranch(): void {
    this.getBranchByName(this.keyBranch, 1, this.isAvailable);
  }

  deleteBranch(): void {
    this.isLoading = true;
    this.api.deleteBranch(this.clickedId).subscribe(
      (response: boolean) => {
        if (response) {
          this.callAlert('Ok', 'Xóa chi nhánh thành công');
        } else {
          this.callAlert('Ok', 'Không thể xóa vì đang được sử dụng');
        }
        this.isLoading = false;
        this.getBranchByName('', 1, this.isAvailable);
      },
      (error) => {
        console.log(error);
        this.callAlert('Ok', 'Có lỗi xảy ra, vui lòng thử lại');
        this.isLoading = false;
      }
    );
  }

  getBranchByName(name: string, pageNo: number, isAvailable: boolean) {
    this.isLoading = true;
    this.api.getBranchByName(name, pageNo, 10, isAvailable).subscribe(
      (response: BranchArray) => {
        this.branchResponse = response;
        this.branchArray = this.branchResponse.branchResponseDtos;
        this.totalPage = this.branchResponse.pageTotal;
        this.pageArray = Array(this.totalPage)
          .fill(1)
          .map((x, i) => i + 1)
          .reverse();
        this.currentPage = this.branchResponse.pageNo;
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        this.callAlert('Ok', 'Có lỗi xảy ra khi tải, vui lòng thử lại');
      }
    );
  }

  changePage(page: number): void {
    if (this.keyBranch === '') {
      this.getBranchByName('', page, this.isAvailable);
    } else {
      this.getBranchByName(this.keyBranch, page, this.isAvailable);
    }
  }

  viewCurrentBranch(): void {
    if (!this.isAvailable) {
      this.isAvailable = true;
      this.getBranchByName('', 1, this.isAvailable);
    }
  }

  viewDeletedBranch(): void {
    if (this.isAvailable) {
      this.isAvailable = false;
      this.getBranchByName('', 1, this.isAvailable);
    }
  }

  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';

  doYes(): void {
    this.haveAlertYN = false;
    this.deleteBranch();
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
    this.clickedId = param;
  }

  goToDetail(branch?: Branch): void {
    let dialogRef = this.dialog.open(BranchDialogComponent, {
      data: { branch: branch },
    });
    dialogRef.afterClosed().subscribe((data: boolean) => {
      if (data) {
        this.getBranchByName('', 1, this.isAvailable);
      }
    });
  }
}
