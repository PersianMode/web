import {Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {HttpService} from 'app/shared/services/http.service';
import {ProgressService} from 'app/shared/services/progress.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-sm-report',
  templateUrl: './sm-report.component.html',
  styleUrls: ['./sm-report.component.css']
})
export class SmReportComponent implements OnInit {

  form: FormGroup;


  constructor(private dialogRef: MatDialogRef<SmReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpService: HttpService,
    private progressService: ProgressService,
    private snackBar: MatSnackBar) {}


  ngOnInit() {
    this.form = new FormBuilder().group({
      report: ['', Validators.required]
    });
  }


  setReport() {
    this.progressService.enable();

    this.httpService.post('sm/close', {
      id: this.data.message._id,
      report: this.form.controls['report'].value
    }).subscribe(res => {
      this.progressService.disable();
      this.openSnackBar('گزارش پیام با موفقیت ثبت شد');
      this.dialogRef.close();

    }, err => {
      this.progressService.disable();
      this.openSnackBar('خطا در ثبت گزارش پیام');
      this.dialogRef.close();
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }


}
