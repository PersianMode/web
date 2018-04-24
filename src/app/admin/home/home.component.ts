import {AfterViewInit, Component, ElementRef, OnInit, Renderer, ViewChild} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('one') d1: ElementRef;
  test = `<div dir="rtl" style="background-color: red; padding: 10px;" class="hi">سلام این متن <b>bold</b>است</div>`;

  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.d1.nativeElement.insertAdjacentHTML('beforeend', this.test);
  }

}
