import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopProductComponent } from './components/desktop-product/desktop-product.component';
import {ProductRouting} from './product.routing';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {SizePickerComponent} from '../../shared/components/size-picker/size-picker.component';
import {MatExpansionModule, MatIconModule, MatTooltipModule} from '@angular/material';
import {MarkdownModule} from 'angular2-markdown';
import { ProductComponent } from './components/product/product.component';
import { MobileProductComponent } from './components/mobile-product/mobile-product.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  imports: [
    CommonModule,
    ProductRouting,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
    MarkdownModule,
    MatExpansionModule,
    SwiperModule,
  ],
  declarations: [
    DesktopProductComponent,
    SizePickerComponent,
    ProductComponent,
    MobileProductComponent,
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})
export class ProductModule { }
