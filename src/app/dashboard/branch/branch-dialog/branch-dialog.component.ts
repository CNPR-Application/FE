import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Branch } from 'src/interfaces/Branch';
import { ApiService } from 'src/service/api.service';
import { ValidationService } from 'src/service/validation.service';

@Component({
  selector: 'app-branch-dialog',
  templateUrl: './branch-dialog.component.html',
  styleUrls: ['./branch-dialog.component.scss'],
})
export class BranchDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<BranchDialogComponent>,
    private validationService: ValidationService
  ) {}

  branch?: Branch;
  openingDate?: string;
  // for alert, loading
  isLoading: boolean = false;
  haveAlertOk: boolean = false;
  haveAlertYN: boolean = false;
  alertMessage: string = '';
  isValid: boolean = false;
  //for edit/ create
  isEdit: boolean = false;
  isUndo: boolean = false;
  //form
  form: FormGroup = this.formBuilder.group({
    id: ['', Validators.required],
    name: ['', Validators.required],
    address: ['', Validators.required],
    openingDate: [''],
    phone: [''],
  });
  //isSuccess
  isSuccess = false;
  isAvailable?: boolean;

  ngOnInit(): void {
    this.branch = this.data.branch;
    if (this.branch !== undefined) {
      if (this.branch.isAvailable) {
        this.isEdit = true;
        this.isUndo = false;
      } else {
        this.isUndo = true;
        this.isEdit = false;
      }
      this.form.controls.id.setValue(this.branch?.branchId);
      this.form.controls.name.setValue(this.branch?.branchName);
      this.form.controls.address.setValue(this.branch?.address);
      this.form.controls.phone.setValue(this.branch?.phone);
      this.openingDate = this.branch.openingDate;
      this.isAvailable = this.branch.isAvailable;
    } else {
      this.isEdit = false;
    }
  }

  editBranch() {
    // 06/12/2021 QuangHN Add Validate for edit branch form START
    let branchName = this.form.controls.name.value;
    let phone = this.form.controls.phone.value;
    let openingDate = this.form.controls.openingDate.value;
    let address = this.form.controls.address.value;

    // check null
    if (this.validationService.isNull(branchName, 'T??n chi nh??nh')) {
      return;
    }
    if (this.validationService.isNull(phone, 'S??? ??i???n tho???i')) {
      return;
    }
    if (this.validationService.isNull(openingDate, 'Ng??y khai tr????ng')) {
      return;
    }
    if (this.validationService.isNull(address, '?????a ch???')) {
      return;
    }

    // check invalid
    if (this.validationService.isInvalidInput(branchName, 'T??n chi nh??nh')) {
      return;
    }
    if (this.validationService.isInvalidPhone(phone)) {
      return;
    }
    if (this.validationService.isInvalidTextArea(address, '?????a ch???')) {
      return;
    }
    // 06/12/2021 QuangHN Add Validate for edit branch form END

    this.isLoading = true;
    this.openingDate = this.form.controls.openingDate.value;
    const request: Branch = {
      branchId: this.form.controls.id.value,
      branchName: this.form.controls.name.value,
      address: this.form.controls.address.value,
      phone: this.form.controls.phone.value,
      openingDate: this.openingDate,
      isAvailable: this.isAvailable,
    };
    this.api.editBranch(request).subscribe(
      (response: boolean) => {
        this.isLoading = false;
        if (response) {
          this.callAlert('Ok', 'Ch???nh s???a th??nh c??ng');
          this.isSuccess = true;
        } else {
          this.callAlert('Ok', 'T??n chi nh??nh ???? t???n t???i, vui l??ng th??? l???i');
          this.isSuccess = false;
        }
      },
      (error) => {
        console.log(error);
        this.callAlert('Ok', 'C?? l???i x???y ra khi ch???nh s???a, vui l??ng th??? l???i');
        this.isLoading = false;
        this.isSuccess = false;
      }
    );
  }

  createBranch() {
    // 06/12/2021 QuangHN Add Validate for create branch form START
    let branchName = this.form.controls.name.value;
    let phone = this.form.controls.phone.value;
    let openingDate = this.form.controls.openingDate.value;
    let address = this.form.controls.address.value;

    // check null
    if (this.validationService.isNull(branchName, 'T??n chi nh??nh')) {
      return;
    }
    if (this.validationService.isNull(phone, 'S??? ??i???n tho???i')) {
      return;
    }
    if (this.validationService.isNull(openingDate, 'Ng??y khai tr????ng')) {
      return;
    }
    if (this.validationService.isNull(address, '?????a ch???')) {
      return;
    }

    // check invalid
    if (this.validationService.isInvalidInput(branchName, 'T??n chi nh??nh')) {
      return;
    }
    if (this.validationService.isInvalidPhone(phone)) {
      return;
    }
    if (this.validationService.isInvalidTextArea(address, '?????a ch???')) {
      return;
    }
    // 06/12/2021 QuangHN Add Validate for create branch form END
    this.isLoading = true;
    this.openingDate = this.form.controls.openingDate.value;
    const request: Branch = {
      branchId: 0,
      branchName: this.form.controls.name.value,
      address: this.form.controls.address.value,
      phone: this.form.controls.phone.value,
      openingDate: this.openingDate,
    };
    this.api.createBranch(request).subscribe(
      (response: boolean) => {
        if (response) {
          this.callAlert('Ok', 'T???o m???i th??nh c??ng');
          this.isSuccess = true;
        } else {
          this.callAlert('Ok', 'T??n n??y ???? t???n t???i, vui l??ng th??? l???i');
          this.isSuccess = false;
        }
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.callAlert('Ok', 'C?? l???i x???y ra khi t???o m???i, vui l??ng th??? l???i');
        this.isLoading = false;
        this.isSuccess = false;
      }
    );
  }

  close(): void {
    this.haveAlertOk = false;
    if (this.isSuccess) {
      this.dialogRef.close(true);
    }
  }

  doYes(): void {
    this.isAvailable = true;
    this.editBranch();
    this.haveAlertYN = false;
  }

  doNo(): void {
    this.haveAlertYN = false;
  }

  callAlert(type: string, message: string) {
    this.alertMessage = message;
    if (type === 'Ok') {
      this.haveAlertOk = true;
    } else {
      this.haveAlertYN = true;
    }
  }
}
