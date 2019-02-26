import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import {TitleService} from '../../../../shared/services/title.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PlacementModifyEnum} from '../../../page/enum/placement.modify.type.enum';
import {ProgressService} from '../../../../shared/services/progress.service';
import {HttpService} from '../../../../shared/services/http.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-upload-track',
  templateUrl: './upload-track.component.html',
  styleUrls: ['./upload-track.component.css']
})
export class UploadTrackComponent implements OnInit {

  uploadTrackForm: FormGroup;
  selectedItem = null;
  anyChanges = false;


  constructor(private snackBar: MatSnackBar, private titleService: TitleService,
              private dialogRef: MatDialogRef<UploadTrackComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private progressService: ProgressService, private httpService: HttpService,
              private sanitizer: DomSanitizer) {
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

  Success($event: Event) {

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

  // modifyItem() {
  //   this.progressService.enable();
  //   this.selectedItem ? this.httpService.post('placement', {
  //
  //     trackName : (this.uploadTrackForm.controls['trackName'].value ? this.uploadTrackForm.controls['trackName'].value : '').trim(),
  //     artistName : (this.uploadTrackForm.controls['artistName'].value ? this.uploadTrackForm.controls['artistName'].value : '').trim()
  //
  //   }).subscribe(
  //     (data: any) => {
  //       this.anyChanges = false;
  //       this.progressService.disable();
  //     },
  //     (err) => {
  //       console.error('Cannot save item in server: ', err);
  //       this.progressService.disable();
  //     }
  //   )
  // }
  setThumbnail(result: any) {
    this.data.product_color.image.thumbnail = result[0];
    // this.thumbnailURL = this.getURL(this.data.product_color.image.thumbnail);
  }

  getURL(name) {
    if (name) {
      const path = [HttpService.Host,
        HttpService.APP_TRACK_PATH,
        this.data.artistName,
        this.data.trackName,
        name].join('/');
      return this.sanitizer.bypassSecurityTrustResourceUrl(path);
    } else
      return '';
  }

  clearFields() {
    this.uploadTrackForm.reset();
    this.selectedItem = null;
    this.uploadTrackForm.controls['area'].enable();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
