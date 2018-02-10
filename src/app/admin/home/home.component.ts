import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('drawer') drawer;
  navLinks = [
    {label: 'Collections', path: '/agent/collections'},
    {label: 'Products', path: '/agent/products'},
  ];
  showBurgerMenu: boolean = false;
  height: number = 300;
  selectedLink = 'Collections';
  constructor() { }


  ngOnInit() {
  }

  menuIsOpen(data?) {
    if (data) {
      console.log(data);
    }

    return true;
  }

  selectOnLink(link) {
    this.selectedLink = link;
    this.drawer.close();
  }

}
