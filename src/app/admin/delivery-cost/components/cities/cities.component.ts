import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {
  cityArray: any;
  @Input() durationObject;
  @Input() cityLabel;

  @Output() selectedCities = new EventEmitter();
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('assets/province.json').subscribe(
      (info: any) => {
        this.cityArray = info;
      }, err => {
        console.log('err: ', err);
      }
    );
  }
  setNewCity(newCity) {
    this.selectedCities.emit(newCity);
  }

}
