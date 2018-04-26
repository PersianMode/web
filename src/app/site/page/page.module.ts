import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './components/page/page.component';
import {PageRouting} from './page.routing';
import {MatCardModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MarkdownModule} from 'angular2-markdown';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  imports: [
    PageRouting,
    MatCardModule,
    FlexLayoutModule,
    MarkdownModule.forRoot(),
    CommonModule,
    SharedModule,
  ],
  declarations: [PageComponent]
})
export class PageModule { }
