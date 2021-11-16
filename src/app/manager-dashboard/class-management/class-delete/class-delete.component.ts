import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClassDeleteRequest } from 'src/interfaces/Class';

@Component({
  selector: 'app-class-delete',
  templateUrl: './class-delete.component.html',
  styleUrls: ['./class-delete.component.scss'],
})
export class ClassDeleteComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ClassDeleteComponent>,
    private formBuilder: FormBuilder
  ) {}

  //form
  form: FormGroup = this.formBuilder.group({
    reason: ['', Validators.required],
  });

  ngOnInit(): void {}

  delete(): void {
    let request: ClassDeleteRequest = {
      classId: this.data.classId,
      reason: this.form.controls.reason.value,
    };
    this.dialogRef.close(request);
  }
}
