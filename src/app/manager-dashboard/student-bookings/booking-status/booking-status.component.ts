import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Booking } from 'src/interfaces/Booking';

@Component({
  selector: 'app-booking-status',
  templateUrl: './booking-status.component.html',
  styleUrls: ['./booking-status.component.scss'],
})
export class BookingStatusComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BookingStatusComponent>,
    private formBuilder: FormBuilder
  ) {}

  booking?: Booking;

  //form
  form: FormGroup = this.formBuilder.group({
    id: ['', Validators.required],
    status: ['', Validators.required],
    description: ['', Validators.required],
  });

  ngOnInit(): void {
    this.booking = this.data.booking;
    this.form.controls.id.setValue(this.booking?.bookingId);
    this.form.controls.status.setValue(this.booking?.status);
    this.form.controls.description.setValue(this.booking?.description);
  }

  close(): void {
    let request: Booking = {
      bookingId: this.booking?.bookingId,
      status: this.form.controls.status.value,
      description: this.form.controls.description.value,
    };
    this.dialogRef.close(request);
  }
}
