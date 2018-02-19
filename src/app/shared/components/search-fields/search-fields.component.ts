import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-search-fields',
  templateUrl: './search-fields.component.html',
  styleUrls: ['./search-fields.component.css']
})
export class SearchFieldsComponent implements OnInit {

  @Input() target = null;
  @Output() searching = new EventEmitter<any>();

  targets = [];
  targetList = [];
  searchCtrl = new FormControl();

  phrase = null;

  constructor() { }

  ngOnInit() {


    this.searchCtrl.valueChanges.debounceTime(500).subscribe(
      data => {
        this.phrase = data.trim() !== '' ? data.trim() : null;
        this.searchOnData();

      }, err => {
        console.log("Couldn't refresh", err);
      }
    );
  }

  addTarget(target_index) {

  }

  removeTarget(trg) {

  }

  searchOnData(phrase?) {
    if(!phrase)
      phrase = this.phrase;

    //wondering what this does :-?
    let trg = {};
    this.targets.forEach(el => {
      trg[el] = true;
    });

    let searchData = {
      phrase: phrase,
      options: {
        target: trg,
      },
    };

    this.searching.emit(searchData);
  }

}
