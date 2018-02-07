import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {HttpService} from "../../services/http.service";
import {Observable} from "rxjs/Observable";
import {map} from "rxjs/operator/map";
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.css']
})
export class SuggestionComponent implements OnInit {
  @Input() name = '';
  @Input() placeholder: string = null;
  @Input() fieldNameEn = '';
  @Input() fieldNameFa = '';
  @Input() currentIds: number[] = [];
  @Output() add = new EventEmitter<any>();

  suggestionCtrl: FormControl;
  filteredItems: any[] = [];
  fn = '';

  constructor(private httpService: HttpService) { }
  //Q: don't we need progressiveService here?

  ngOnInit() {
    if(!this.placeholder)
      this.placeholder = this.name;

    this.suggestionCtrl = new FormControl();
    this.suggestionCtrl.valueChanges.debounceTime(150).subscribe(
      (data) => {
        this.filtering(data);
      },
      (err) => {
        this.filteredItems = [];
      }
    );
  }

  addItem(data) {
    const item = this.filteredItems.filter(el => el._id.toLowerCase() === data.option.value.toLowerCase())[0];
    this.add.emit(item);
    this.suggestionCtrl.setValue('');
  }

  filtering(phrase: string) {
    if((!phrase || phrase == '') || phrase.length < 3)
      this.filteredItems = [];
    else {
      //enable progressive bar

      if(phrase.charCodeAt(0) >= 48 && phrase.charCodeAt(0) <= 122)
        this.fn = this.fieldNameEn;
      else
        this.fn = this.fieldNameFa;

      //should be ---> this.httpService.post('suggest', {});
      //But we don't have 'suggest' on server, so for now I used this instead
      //  POST /products/ {phrase: <phrase: string>}
      // AND WE GET: {products: [ {name, product_type.name, brand.name} ]}
      this.httpService.getProductByName({
        //for now, only support for product name
        phrase: phrase
      }).subscribe(
        (data) => {
          data = data.body;
          // console.log(data);
          this.filteredItems = data;
          //disable progressive bar
        },
        (err) => {
          this.filteredItems = [];
          //disable progressive bar
        }
      );
    }
  }

}
