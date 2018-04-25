import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PageService} from '../../../../shared/services/page.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  pageName = '';
  content = '';

  constructor(private route: ActivatedRoute, private pageService: PageService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.pageName = 'page/' + params.get('typeName');
      this.pageService.getPage(this.pageName);
      this.pageService.pageInfo$.filter(r => r[0] === this.pageName).map(r => r[1]).subscribe(res => {
        if (res && res['content']) {
          this.content = res['content'];
        } else {
          console.error('-> ', `${this.pageName} is getting empty data for page`);
        };
      });
    });
  }
}
