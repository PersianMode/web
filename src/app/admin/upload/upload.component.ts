import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {TitleService} from '../../shared/services/title.service';
import {HttpService} from 'app/shared/services/http.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  progress: Number = 0;

  constructor(private snackBar: MatSnackBar, private titleService: TitleService, private httpService: HttpService) {}

  ngOnInit() {
    this.titleService.setTitleWithOutConstant('ادمین: بارگذاری فایل');
  }

  OnResult(result: any) {

    if (!result || !result.length) {
      this.snackBar.open('خطا به هنگام بارگذاری فایل', null, {
        duration: 2000,
      });
    }

    this.requestForProgress();

  }
  async requestForProgress() {
    try {
      const result = await this.httpService.get('upload/progress').toPromise();
      this.progress = Math.ceil(result * 100) ;

      if (this.progress === 100) {
        return;
      }
      setTimeout(() => {
        this.requestForProgress();
      }, 5000);

    } catch (err) {
      this.progress = 0;
      console.log('-> ', err);
    }


  }
}
