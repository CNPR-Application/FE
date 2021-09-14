import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Guest } from 'src/app/interfaces/Account';

@Component({
  selector: 'app-status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.scss'],
})
export class StatusDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<StatusDialogComponent>,
    private formBuilder: FormBuilder
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
    let guestChanged: Guest = {
      id: this.guest?.id,
      status: this.form.controls.status.value,
      description: this.form.controls.description.value,
    };
    this.dialogRef.close(guestChanged);
  }
}
