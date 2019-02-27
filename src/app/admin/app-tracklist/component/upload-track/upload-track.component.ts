import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import {TitleService} from '../../../../shared/services/title.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProgressService} from '../../../../shared/services/progress.service';
import {HttpService} from '../../../../shared/services/http.service';

@Component({
  selector: 'app-upload-track',
  templateUrl: './upload-track.component.html',
  styleUrls: ['./upload-track.component.css']
})
export class UploadTrackComponent implements OnInit {

  uploadTrackForm: FormGroup;
  selectedItem = null;
  anyChanges = false;
  priority = 1

  constructor(private snackBar: MatSnackBar, private titleService: TitleService,
              private dialogRef: MatDialogRef<UploadTrackComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private progressService: ProgressService, private httpService: HttpService) {
    {
      dialogRef.disableClose = true;
    }
  }

  ngOnInit() {
    this.titleService.setTitleWithOutConstant('ادمین: بارگذاری فایل');
    this.initForm();

    this.uploadTrackForm.valueChanges.subscribe(
      () => this.fieldChanged()
    );
  }

  fieldChanged() {
    if (!this.selectedItem) {
      this.anyChanges = true;
      return;
    }
  }

  Success(result: any) {
    this.data = result[0];
    console.log('this.data result',this.data);
    this.snackBar.open('File is uploaded successfully', null, {
      duration: 2000,
    });

  }

  initForm() {
    this.uploadTrackForm = new FormBuilder().group({
      trackName: [null, [
        Validators.required]],
      artistName: [null, [
        Validators.required]
      ]
    })
  }

  submit() {
    this.progressService.enable();
    const sendingData = {
      artistName: this.uploadTrackForm.controls['artistName'].value,
      trackName: this.uploadTrackForm.controls['trackName'].value,
      priority: this.priority + 1
      // this.dataTrack.path =
      // this.dataTrack.order
    }
    this.httpService.post('trackList', sendingData).subscribe(
      data => {
        this.anyChanges = false;
        this.snackBar.open('آهنگ با موفقیت آپلود شد', null, {
          duration: 3200
        });
        this.progressService.disable();
        this.closeDialog();
      },
      err => {
        console.error('Cannot save item in server: ', err);
        this.snackBar.open('سیستم قادر به آپلود آهنگ نیست، لطفا دوباره تلاش کنید', null, {
          duration: 3200
        });
        this.progressService.disable();
      }
    )
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
