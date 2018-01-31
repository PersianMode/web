import {NgModule} from '@angular/core';
import {SiteRouting} from './site.routing';
import {CommonModule} from '@angular/common';
import {SiteComponent } from './site.component';
import {HeaderComponent} from '../shared/components/header/header.component';
import {CollectionHeaderComponent} from '../shared/components/collection-header/collection-header.component';
import {SlidingHeaderComponent} from '../shared/components/sliding-header/sliding-header.component';
import {MobileHeaderComponent} from '../shared/components/mobile-header/mobile-header.component';
import {
  MatButtonModule,
  MatIconModule,
  MatSidenavModule
} from '@angular/material';
import {FooterComponent} from '../shared/components/footer/footer.component';
import {FlexLayoutModule} from '@angular/flex-layout';



@NgModule({
  imports: [
    SiteRouting,
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
  ],
  declarations: [
    HeaderComponent,
    CollectionHeaderComponent,
    SlidingHeaderComponent,
    SiteComponent,
    FooterComponent,
    MobileHeaderComponent,
    SiteComponent
  ],
})
export class SiteModule {
}
