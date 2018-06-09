import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-cost',
  templateUrl: './cost.component.html',
  styleUrls: ['./cost.component.css']
})
export class CostComponent implements OnInit {
  finalCostList;
  @Input()
  set cityArray(value) {
    if (value && value.length) {
      value.forEach(el => {
        if (!this.deliveryCostList.map(i => i.name).includes(el))
          this.deliveryCostList.push({
            name: el,
            value: null,
          });
      });
    } else
      this.deliveryCostList = [];
  }

  @Input() costLabel;

  deliveryCostList = [];

  constructor() {
  }

  ngOnInit() {
  }

  submitCost() {
    this.finalCostList = this.deliveryCostList;
  }

}
