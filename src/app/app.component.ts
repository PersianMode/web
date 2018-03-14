import {Component, OnInit} from '@angular/core';
import {DictionaryService} from './shared/services/dictionary.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private dictionaryService: DictionaryService) {

  }

}
