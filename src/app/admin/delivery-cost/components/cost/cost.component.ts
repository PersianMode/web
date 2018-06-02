import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-cost',
  templateUrl: './cost.component.html',
  styleUrls: ['./cost.component.css']
})
export class CostComponent implements OnInit {
  @Input() cityArray;
  @Input() costLabel;
  constructor() { }

  ngOnInit() {
  }

}
