import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './components/page/page.component';
import {PageRouting} from './page.routing';
import { MatCardModule } from '@angular/material/card';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgxMdModule} from 'ngx-md';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  imports: [
    PageRouting,
    MatCardModule,
    FlexLayoutModule,
    NgxMdModule.forRoot(),
    CommonModule,
    SharedModule,
  ],
  declarations: [PageComponent]
})
export class PageModule { }
