import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {
  provinceArray: any;
  @Input() durationObject;
  @Input() cityLabel;

  @Output() selectedCities = new EventEmitter();
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('assets/province.json').subscribe(
      (info: any) => {
        this.provinceArray = info;
      }, err => {
        console.log('err: ', err);
      }
    );
  }
  setNewProvince(newProvince) {
    this.selectedCities.emit(newProvince);
  }

}
