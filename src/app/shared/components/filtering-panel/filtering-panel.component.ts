import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filtering-panel',
  templateUrl: './filtering-panel.component.html',
  styleUrls: ['./filtering-panel.component.css']
})
export class FilteringPanelComponent implements OnInit {

  constructor() { }
items = [];
  ngOnInit() {
    for(let i=0;i<100;i++)this.items.push(i+1);
  }

}
