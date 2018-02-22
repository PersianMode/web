import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {HttpService} from '../../services/http.service';
// import {Observable} from "rxjs/Observable";
// import {map} from "rxjs/operator/map";
import 'rxjs/add/operator/debounceTime';
import {ProgressService} from '../../services/progress.service';

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

  constructor(private httpService: HttpService, private progressService: ProgressService) { }

  ngOnInit() {
    if (!this.placeholder)
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
    if ((!phrase || phrase === '') || phrase.length < 3)
      this.filteredItems = [];
    else {
      this.progressService.enable();

      if (phrase.charCodeAt(0) >= 48 && phrase.charCodeAt(0) <= 122)
        this.fn = this.fieldNameEn;
      else
        this.fn = this.fieldNameFa;

      this.httpService.suggest(name, {
        name: phrase
        // phrase: phrase
      }).subscribe(
        (data: any) => {
          this.filteredItems = data;
          this.progressService.disable();
        },
        (err) => {
          this.filteredItems = [];
          this.progressService.disable();
        }
      );
    }
  }

}
