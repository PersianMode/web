import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {IPlacement} from '../../interfaces/IPlacement.interface';
import {HttpService} from '../../../../shared/services/http.service';
import {MatSnackBar} from '@angular/material';
import {WINDOW} from '../../../../shared/services/window.service';
import {Router} from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-placement',
  templateUrl: './placement.component.html',
  styleUrls: ['./placement.component.css']
})
export class PlacementComponent implements OnInit {
  @Input() isApp = false;
  @Input() pageId = null;
  @Input() pageAddress = '';

  @Input() placements: IPlacement[] = [];
  @Output() modifyPlacement = new EventEmitter();
  @Output() reloadPlacement = new EventEmitter();
  @Output() dateIsChanged = new EventEmitter();

  finalizeRevertShouldDisabled = false;
  previewShouldDisabled = false;
  placement_date: any = new Date();

  constructor(private httpService: HttpService, public snackBar: MatSnackBar,
    @Inject(WINDOW) private window, private router: Router) {
  }

  ngOnInit() {
  }

  getRelatedPlacements(type) {
    return this.placements ? this.placements.filter(el => el.component_name.toLowerCase() === type.toLowerCase()) : [];
  }

  modify(value) {
    this.modifyPlacement.emit(value);
  }

  reload(value) {
    this.reloadPlacement.emit();
  }

  finalize(shouldFinalize = false) {
    this.finalizeRevertShouldDisabled = true;
    this.previewShouldDisabled = true;

    this.httpService.post('placement/finalize', {
      page_id: this.pageId,
      is_finalized: shouldFinalize,
    }).subscribe(
      (data) => {
        this.snackBar.open(shouldFinalize ? 'تغییرات با موفقیت تثبیت شدند' : 'تغییرات با موفقیت برگردانده شدند', null, {
          duration: 2300,
          direction: 'rtl',
        });

        this.reloadPlacement.emit();
        this.finalizeRevertShouldDisabled = false;
        this.previewShouldDisabled = false;
      },
      (err) => {
        this.snackBar.open('برخی/همه تغیثیرات تثبیت نشدند', null, {
          duration: 3200,
        });

        console.error('Error when finalizing placements: ', err);
        this.finalizeRevertShouldDisabled = false;
        this.previewShouldDisabled = false;
      });
  }

  preview() {
    this.window.open(
      this.router.url.split('/')[0] +
      '/' +
      this.pageAddress +
      '?preview&date=' +
      moment(this.placement_date).format('YYYY-MM-DD')
    );
  }

  placementDateIsChanged() {
    if (moment(moment(this.placement_date).format('YYYY-MM-DD')).isAfter(moment(new Date()).format('YYYY-MM-DD'))) {
      this.snackBar.open('تاریخ انتخاب شده معتبر نمی باشد', null, {
        duration: 3200,
      });
      this.goToToday();
      return;
    }
    this.dateIsChanged.emit(this.placement_date);
  }

  goToToday() {
    this.placement_date = new Date();
  }

  canEdit() {
    return moment(moment(this.placement_date).format('YYYY-MM-DD')).isSame(moment(new Date).format('YYYY-MM-DD'));
  }
}
