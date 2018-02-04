import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.css']
})
export class MobileHeaderComponent implements OnInit {
  @ViewChild('sidenav') sideNav;
  @Input() menuWidth = 100;
  @Input() menuHeight = 100;

  isLoggedIn = false;
  sideNavIsOpen = false;
  isFirstLevel = true;
  isSecondLevel = false;
  isThirdLevel = false;
  firstLevelSelected = null;
  secondLevelSelected = null;
  secondLevelTitle = null;
  thirdLevelTitle = null;

  menuItems = {
    'مردانه': {
      is_title: false,
      menu: {
        'محصولات جدید': {
          is_title: false,
          url: '',
        },
        'کفش': {
          menu: {
            'تمام کفش های مردانه': {
              is_title: false,
              url: '',
            },
            'سبک زندگی': {
              is_title: false,
              url: '',
            },
          }
        },
      }
    },
    'زنانه': {
      is_title: false,
      menu: {}
    },
    'پسرانه': {
      is_title: false,
      menu: {}
    },
    'دخترانه': {
      is_title: false,
      menu: {}
    },
    'محصولات جدید': {
      is_title: false,
      url: '',
    },
    'سفارشی': {
      is_title: false,
      url: '',
    },
    'باشگاه نایک': {
      is_title: false,
      menu: {}
    },
    'بر مبنای برند': {
      is_title: true,
    },
    'ست ورزشی': {
      is_title: false,
      url: '',
    },
    'خدمات': {
      is_title: true,
    },
    'درخواست یاری': {
      is_title: false,
      url: '',
    },
    'تماس با ما': {
      is_title: false,
      url: '',
    },
    'کارت هدیه': {
      is_title: false,
      url: '',
    }
  };

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(
      (data) => this.isLoggedIn = data,
      (err) => console.error('Cannot subscribe to isloggedin')
    );
  }

  getKeys(object) {
    const temp = object ? Object.keys(object) : [];
    return temp;
  }

  select(targetLevel, object, title) {
    if (!object || !object.hasOwnProperty('url')) {
      if (targetLevel === 1) {
        this.isFirstLevel = true;
        this.isSecondLevel = false;
        this.isThirdLevel = false;
      } else if (targetLevel === 2) {
        this.isFirstLevel = false;
        this.isSecondLevel = true;
        this.isThirdLevel = false;
        this.firstLevelSelected = object.menu;
        this.secondLevelTitle = title;
      } else if (targetLevel === 3) {
        this.isFirstLevel = false;
        this.isSecondLevel = false;
        this.isThirdLevel = true;
        this.secondLevelSelected = object.menu;
        this.thirdLevelTitle = title;
      }
    } else {
      // Redirect to specific url
      this.router.navigate([object.url]);
      this.sideNav.close();
    }
  }

  back(targetLevel) {
    if (targetLevel === 1) {
      this.isFirstLevel = true;
      this.isSecondLevel = false;
      this.isThirdLevel = false;
    } else if (targetLevel === 2) {
      this.isFirstLevel = false;
      this.isSecondLevel = true;
      this.isThirdLevel = false;
    } else if (targetLevel === 3) {
      this.isFirstLevel = false;
      this.isSecondLevel = false;
      this.isThirdLevel = true;
    }
  }

  backDropClick(data) {
    this.isFirstLevel = true;
    this.isSecondLevel = false;
    this.isThirdLevel = false;
    this.sideNav.toggle();
  }

  authentication() {
    this.router.navigate(['login']);
    this.sideNav.close();
  }
}
