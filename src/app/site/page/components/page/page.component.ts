import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PageService} from '../../../../shared/services/page.service';
import {TitleService} from '../../../../shared/services/title.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  @ViewChild('content') contentEl: ElementRef;
  pageName = '';
  content = '';

  constructor(private route: ActivatedRoute, private pageService: PageService,
              private titleService: TitleService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.pageName = 'page/' + params.get('typeName');
      this.pageService.getPage(this.pageName);
      this.pageService.pageInfo$.filter(r => r[0] === this.pageName).map(r => r[1]).subscribe(res => {
        if (res && res['content']) {
          this.content = res['content'];
          this.contentEl.nativeElement.innerHTML = '';
          if (this.content)
            this.contentEl.nativeElement.insertAdjacentHTML('beforeend', this.content);
        } else {
          console.error('-> ', `${this.pageName} is getting empty data for page`);
        }
        if (res && res['title']) {
          this.titleService.setTitleWithConstant(res['title']);
        }
      });
    });
  }
}
