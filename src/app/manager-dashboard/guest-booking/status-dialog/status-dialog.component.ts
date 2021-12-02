import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Guest } from 'src/interfaces/Account';
import { ValidationService } from 'src/service/validation.service';

@Component({
  selector: 'app-status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.scss'],
})
export class StatusDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<StatusDialogComponent>,
    private formBuilder: FormBuilder,
    private validationService: ValidationService
  ) {}

  guest?: Guest;

  //form
  form: FormGroup = this.formBuilder.group({
    id: ['', Validators.required],
    status: ['', Validators.required],
    description: ['', Validators.required],
  });

  ngOnInit(): void {
    this.guest = this.data.guest;
    this.form.controls.id.setValue(this.guest?.id);
    this.form.controls.status.setValue(this.guest?.status);
    this.form.controls.description.setValue(this.guest?.description);
  }

  close(): void {
    // 02/12/2021 QuangHN Add validate for status dialog START
    let description = this.form.controls.description.value;

    // check invalid
    if (this.validationService.isInvalidTextArea(description, 'Ghi chú')) {
      return;
    }
    // 02/12/2021 QuangHN Add validate for status dialog END

    let guestChanged: Guest = {
      id: this.guest?.id,
      status: this.form.controls.status.value,
      description: this.form.controls.description.value,
    };
    this.dialogRef.close(guestChanged);
  }
}
