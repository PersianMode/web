import {Component, OnInit} from '@angular/core';
import {DragulaService} from 'ng2-dragula';
import {Subscription} from 'rxjs/Subscription';
import {HttpService} from '../../shared/services/http.service';
import {ProgressService} from '../../shared/services/progress.service';
import {MatSnackBar, MatDialog} from '@angular/material';


@Component({
  selector: 'app-deliverypriority',
  templateUrl: './deliverypriority.component.html',
  styleUrls: ['./deliverypriority.component.css']
})
export class DeliverypriorityComponent implements OnInit {
  fieldBag = 'field-bag';
  subs = new Subscription();
  warehouse = [];

  constructor(private dragulaService: DragulaService, private snackBar: MatSnackBar, private httpService: HttpService, private progressService: ProgressService) {

  }

  ngOnInit() {

    if (!this.dragulaService.find(this.fieldBag)) {
      this.dragulaService.setOptions(this.fieldBag, {
        direction: 'veritcal',
        copy: false,

      });

      this.dragulaService.dropModel.subscribe(value => {

        this.warehouse.forEach(el => {
          el.priority = this.warehouse.indexOf(el);
        });
      });
    }
    this.getwarehouse();

  }

  getwarehouse() {
    this.progressService.enable();
    this.httpService.get('warehouse/all').subscribe(
      data => {

        this.warehouse = data;

        this.warehouse.sort((a, b) => {
          return a.priority - b.priority
        })
        this.progressService.disable();
      },
      err => {
        this.progressService.disable();
        console.error('Cannot get warehouses ', err);
        this.snackBar.open('قادر به دریافت اطلاعات انبار ها نیستیم. دوباره تلاش کنید', null, {
          duration: 3200,
        });
      }
    );
  }
  update() {
    this.progressService.enable();
    this.httpService.put('warehouse/update', {warehouses: this.warehouse}).subscribe(
      (res) => {
        this.progressService.disable();

      },
      (err) => {
        console.error('Cannot edit user info: ', err);
        this.progressService.disable();

      }
    );

  }
}


