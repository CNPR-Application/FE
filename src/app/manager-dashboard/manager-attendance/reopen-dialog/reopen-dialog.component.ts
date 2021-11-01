import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AttendanceReopenRequest } from 'src/interfaces/Attendance';

@Component({
  selector: 'app-reopen-dialog',
  templateUrl: './reopen-dialog.component.html',
  styleUrls: ['./reopen-dialog.component.scss'],
})
export class ReopenDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ReopenDialogComponent>,
    private formBuilder: FormBuilder
  ) {}

  //form
  form: FormGroup = this.formBuilder.group({
    sessionId: ['', Validators.required],
    reason: ['', Validators.required],
  });

  ngOnInit(): void {
    this.form.controls.sessionId.setValue(this.data.sessionId);
  }

  reopen(): void {
    let request: AttendanceReopenRequest = {
      sessionId: this.form.controls.sessionId.value,
      reopenReason: this.form.controls.reason.value,
    };
    this.dialogRef.close(request);
  }
}
