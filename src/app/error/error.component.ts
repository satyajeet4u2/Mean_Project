import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';

@Component({
  templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string, err: any }) {}

  ngOnInit(): void {
    console.log('error from errorComponent', this.data.err);
  }

  // messgae = 'An unknown error occurred';
}
