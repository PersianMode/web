import {Component, OnInit} from '@angular/core';
import {PrintService} from '../../services/print.service';

@Component({
  selector: 'app-shelf-code-printer',
  templateUrl: './shelf-code-printer.component.html',
  styleUrls: ['./shelf-code-printer.component.css']
})
export class ShelfCodePrinterComponent implements OnInit {

  constructor(private printService: PrintService) {
  }

  ngOnInit() {
    this.printService.printShelfCode('XY');
  }

}
