import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from "@angular/material";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  hiddenGenderMenu = true;
  persistedList = false;
  doNotClose = false;
  selected = {
    men: false,
    women: false,
    boys: false,
    girls: false,
  };
  logos = [
    {
      brand: 'Nike',
      filename: 'nike',
      // height: 34,
      // top: 2,
      // right: 5,
      width: 60,
    },
    {
      brand: 'Converse',
      filename: 'converse',
      height: 36,
      top: 4,
      width: 77,
      right: 7,
    },
    {
      brand: 'Nike Jordan',
      filename: 'nike-jordan',
      top: 2,
      width: 88,
      right: 4,
    },
    {
      brand: 'Hurley',
      filename: 'Hurley',
      height: 45,
      top: 8,
    },
    {
      brand: 'The North Face',
      filename: 'thenorthface',
      top: 27,
      height: 84,
      width: 76,
      right: 3,
    },
    {
      brand: 'Timberland',
      filename: 'timberland',
      top: 41,
      height: 110,
      width: 110,
    },
    {
      brand: 'Polo Ralph Lauren',
      filename: 'Polo-Ralph-Lauren-Clean',
      top: 10,
      height: 50,
      width: 38,
      right: 16,
    },
    {
      brand: 'ASICS',
      filename: 'store-logo-asics',
      height: 34,
      width: 62,
      right: 5,
    },
    {
      brand: 'Adidas',
      filename: 'adidas',
      width: 45,
      right: 3,
    },
    {
      brand: 'Puma',
      filename: 'puma',
    },
    {
      brand: 'Tommy Hilfiger',
      filename: 'tommyhilfiger',
      width: 40,
      right: 4,
    },
  ];

  constructor(iconRegistry: MatIconRegistry) {
    //iconRegistry.setDefaultFontSetClass('fa');
  }

  ngOnInit() {

  }

  showList(type) {
    setTimeout(() => {
      this.hiddenGenderMenu = false;
      this.selected[type] = true;
    }, 100 );
  }

  persistList() {
    this.persistedList = true;
  }

  hideList(x) {
    this.hiddenGenderMenu = true;
    this.persistedList = false;
    for (const i in this.selected) {
      if (this.selected.hasOwnProperty(i)) {
        this.selected[i] = false;
      }
    }
  }

  countDownHideList() {

    setTimeout(() => {
      if (!this.persistedList) {
        this.hideList(0);
      }
    }, 100);
  }
}
