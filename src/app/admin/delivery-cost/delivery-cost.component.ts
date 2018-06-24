import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ProgressService} from '../../shared/services/progress.service';
import {SaveChangeConfirmComponent} from '../../shared/components/save-change-confirm/save-change-confirm.component';

@Component({
  selector: 'app-delivery-cost',
  templateUrl: './delivery-cost.component.html',
  styleUrls: ['./delivery-cost.component.css']
})
export class DeliveryCostComponent implements OnInit {
  showTabs = false;
  loyaltyLabel;
  durationObject: any = {};
  showDeliveryTab: boolean = false;
  showCAndCTab: boolean = false;
  _id;
  shouldNotify = false;
  saveDiscount = null;

  constructor(private route: ActivatedRoute, private dialog: MatDialog,
              private snackBar: MatSnackBar, private progressService: ProgressService) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        this._id = params['id'] && params['id'] !== 'null' ? params['id'] : null;
        if (this._id) {
          this.showDeliveryTab = true;
        }
      }
    );
  }

  deliverySetting(eventObj) {
    if (eventObj) {
      if (eventObj._id && eventObj.name &&
        eventObj.delivery_days &&
        eventObj.cities && eventObj.delivery_loyalty && (eventObj.is_c_and_c === false)) {
        this.showTabs = true;
      }
      // TODO : else case to notify compelete info for select duration (navigate to form)
      this.durationObject = {
        is_c_and_c: false,
        _id: eventObj._id,
        name: eventObj.name,
        delivery_days: eventObj.delivery_days,
        cities: eventObj.cities,
        delivery_loyalty: eventObj.delivery_loyalty,
      };
      this.loyaltyLabel = ' : ' + ' تحویل ' + this.durationObject.name;
    }
    else {
      this.durationObject = {};
      this.showTabs = false;
    }
  }

  goToDeliveryTab() {
    this.showDeliveryTab = true;
    this.showCAndCTab = false;
    // this.shouldNotify = false;
  }

  goToCandCTab() {
    this.showDeliveryTab = false;
    this.showCAndCTab = true;
    this.shouldNotify = false;
    this.saveDiscount = null;
  }

  showNotify(data) {
    this.shouldNotify = !data; // variable 'shouldNotify' says if dialog window whould be open or not by tab changes,
                              // and component waite for tab changing to use this variable's value to open dialog or not
  }

  notifyToSaveChanges() {      // depend on value of shouldNotify, dialog whould open or not(call by tab changes)
    this.saveDiscount = null;  // this variable will pass to internall component as input to mange changes save or cancel
                               // its value will be set in afterCloes function, based on cliking ok or cancel button

    if (this.shouldNotify) {
      const rmDialog = this.dialog.open(SaveChangeConfirmComponent, {
        width: '400px',
      });

      rmDialog.afterClosed().subscribe(
        status => {
          if (status) {
            this.shouldNotify = false;
            this.saveDiscount = true;
          } else {
            this.shouldNotify = false;
            this.saveDiscount = false;
          }
          }
        ,
          err => {
            console.error('Error when subscribing on rmDialog.afterClosed() function: ', err);
          }
        );
    }
  }
}
