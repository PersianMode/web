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
        console.log(this.warehouse);

        this.warehouse.forEach(el => {
          el.priority = this.warehouse.indexOf(el);
        });
        console.log(this.warehouse[0]);
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

        console.log(this.warehouse);
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
    console.log(this.warehouse)
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


