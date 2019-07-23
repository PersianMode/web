import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  fileUploaded;

  constructor(private snackBar: MatSnackBar, private titleService: TitleService,
              public dialogRef: MatDialogRef<UploadTrackComponent>,
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

  onUploadFile(result: any) {
    this.fileUploaded = result[0];
    this.snackBar.open('آهنگ با موفقیت بارگذاری شد', null, {
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

  async submit() {
    this.progressService.enable();
    const priority = await this.getLastPriority();
    console.log({priority});
    const sendingData = {
      artistName: this.uploadTrackForm.controls['artistName'].value,
      trackName: this.uploadTrackForm.controls['trackName'].value,
      path: this.fileUploaded,
      priority: priority + 1
    }
    this.httpService.post('trackList', sendingData).subscribe(
      data => {
        this.anyChanges = false;
        this.snackBar.open('اطلاعات با موفقیت دخیره شد', null, {
          duration: 3200
        });
        this.dialogRef.close(true);
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

  async getLastPriority() {
    try {
      this.progressService.enable();
      const result = await this.httpService.get('trackList/get_tracklist').toPromise();
      this.progressService.disable();
      return result[result.length - 1]['priority'];
    } catch (err) {
      console.log(err);
      this.progressService.disable();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
