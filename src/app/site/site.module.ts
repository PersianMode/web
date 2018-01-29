import {NgModule} from '@angular/core';
import { HomeComponent } from './home/home.component';
import {SiteRouting} from './site.routing';
import {HeaderComponent} from '../shared/componens/header/header.component';
import {CollectionHeaderComponent} from '../shared/componens/collection-header/collection-header.component';
import {SlidingHeaderComponent} from '../shared/componens/sliding-header/sliding-header.component';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    CollectionHeaderComponent,
    SlidingHeaderComponent,
  ],
  imports: [
    SiteRouting,
    CommonModule,
  ]
})
export class SiteModule {
}
