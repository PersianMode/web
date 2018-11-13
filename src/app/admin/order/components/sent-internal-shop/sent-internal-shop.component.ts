import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sent-internal-shop',
  templateUrl: './sent-internal-shop.component.html',
  styleUrls: ['./sent-internal-shop.component.css']
})
export class SentInternalShopComponent implements OnInit {


  @Input() isCentralStore;

  constructor() { }

  ngOnInit() {
  }

}
