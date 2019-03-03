import {Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {UploadTrackComponent} from './component/upload-track/upload-track.component';
import {ProgressService} from '../../shared/services/progress.service';
import {HttpService} from '../../shared/services/http.service';
import {DomSanitizer} from '@angular/platform-browser';
import {DragulaService} from 'ng2-dragula';
import {RemovingConfirmComponent} from '../../shared/components/removing-confirm/removing-confirm.component';

@Component({
  selector: 'app-app-track-list',
  templateUrl: './app-tracklist.component.html',
  styleUrls: ['./app-tracklist.component.css']
})
export class AppTrackListComponent implements OnInit {

  fieldBag = 'field-bag';
  tracklist = [];
  displayedColumns = ['col_no', 'artistName', 'trackName'];

  constructor(private httpService: HttpService,
              private sanitizer: DomSanitizer, private dialog: MatDialog,
              private progressService: ProgressService, private snackBar: MatSnackBar, private dragulaService: DragulaService) {
  }

  ngOnInit() {
    if (!this.dragulaService.find(this.fieldBag)) {
      this.dragulaService.setOptions(this.fieldBag, {
        direction: 'veritcal',
        copy: false,
      });
      this.dragulaService.dropModel.subscribe(value => {
        this.tracklist.forEach(el => {
          el.priority = this.tracklist.indexOf(el);
        });
        console.log(this.tracklist[0]);
      });
    }
    this.getTrackInfo();
  }

  openUploadTrackDialog() {
    const uploadTrackDialog = this.dialog.open(UploadTrackComponent, {
      width: '600px',
      height: '500px',
      autoFocus: false,
    });

    uploadTrackDialog.afterClosed().subscribe(data => {
      this.getTrackInfo()
    })
  }

  getTrackInfo() {
    this.progressService.enable();
    this.httpService.get('trackList/get_tracklist').subscribe(
      data => {
        let i = 0;
        data.map((obj) => {
          obj.index = i++;
          return obj;
        });

        this.tracklist = data;

        this.tracklist.sort((a, b) => {
          return a.priority - b.priority
        });

        this.progressService.disable();
      },
      err => {
        this.progressService.disable();
        console.error('Cannot get tracklist ', err);
        this.snackBar.open('قادر به دریافت لیست آهنگ ها نیستیم. دوباره تلاش کنید', null, {
          duration: 3200,
        });
      }
    );
  }

  update() {
    this.progressService.enable();
    this.httpService.put('trackList/update_tracklist', {tracklists: this.tracklist}).subscribe(
      (res) => {
        this.getTrackInfo();
        this.progressService.disable();
      },
      (err) => {
        console.error('Cannot edit tracklist priority: ', err);
        this.progressService.disable();
      }
    );

  }

  remove(id) {
    console.log('id:', id);
    const rmDialog = this.dialog.open(RemovingConfirmComponent, {
      width: '400px'
    });
    rmDialog.afterClosed().subscribe(
      status => {
        if (status) {
          this.progressService.enable();
          this.httpService.post(`/trackList/delete_track`, {
            _id: id,
          }).subscribe(
            (data) => {
              this.snackBar.open('آهنگ  مورد نظر با موفقیت حذف شد', null, {
                duration: 2000,
              });
              this.getTrackInfo();
              this.progressService.disable();
            }, (err) => {
              this.snackBar.open('سیستم قادر به حذف این آهنگ نیست. دوباره تلاش کنید.', null, {
                duration: 2700,
              });
              console.log('Error', err);
              this.progressService.disable();
            });
        }
      }, err => {
        console.log('Error in dialog: ', err);
      });
  }

  formatter(p) {
    return (+p).toLocaleString('fa');
  }
}

