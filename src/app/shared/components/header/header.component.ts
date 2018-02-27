import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {GenDialogComponent} from "../gen-dialog/gen-dialog.component";
import {DialogEnum} from "../../enum/dialog.components.enum";
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  logos = [
    {
      brand: 'Nike',
      filename: 'nike',
      // height: 34,
      // top: 2,
      // right: 5,
      width: 60,
    },
    {
      brand: 'Converse',
      filename: 'converse',
      height: 36,
      top: 4,
      width: 77,
      right: 7,
    },
    {
      brand: 'Nike Jordan',
      filename: 'nike-jordan',
      top: 2,
      width: 88,
      right: 4,
    },
    {
      brand: 'Hurley',
      filename: 'Hurley',
      height: 45,
      top: 8,
    },
    {
      brand: 'The North Face',
      filename: 'thenorthface',
      top: 27,
      height: 84,
      width: 76,
      right: 3,
    },
    {
      brand: 'Timberland',
      filename: 'timberland',
      top: 41,
      height: 110,
      width: 110,
    },
    {
      brand: 'Polo Ralph Lauren',
      filename: 'Polo-Ralph-Lauren-Clean',
      top: 10,
      height: 50,
      width: 38,
      right: 16,
    },
    {
      brand: 'ASICS',
      filename: 'store-logo-asics',
      height: 34,
      width: 62,
      right: 5,
    },
    {
      brand: 'Adidas',
      filename: 'adidas',
      width: 45,
      right: 3,
    },
    {
      brand: 'Puma',
      filename: 'puma',
    },
    {
      brand: 'Tommy Hilfiger',
      filename: 'tommyhilfiger',
      width: 40,
      right: 4,
    },
  ];
  dialogEnum = DialogEnum;
  isLoggedIn = false;
  isVerified = false;

  constructor(public dialog: MatDialog, private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(
      (data) => this.isLoggedIn = data,
      (err) => {
        console.error('Cannot subscribe on isLoggedIn: ', err);
        this.isLoggedIn = false;
      }
    );
    this.authService.isVerified.subscribe(
      (data) => this.isVerified = data,
      (err) => {
        console.error('Cannot subscribe on isVerified: ', err);
        this.isVerified = false;
      }
    );
  }

  login() {
    this.dialog.open(GenDialogComponent, {
      width: '500px',
      data: {
        componentName: this.dialogEnum.login,
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
