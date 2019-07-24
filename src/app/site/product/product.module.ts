import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopProductComponent } from './components/desktop-product/desktop-product.component';
import {ProductRouting} from './product.routing';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import {NgxMdModule} from 'ngx-md';
import { ProductComponent } from './components/product/product.component';
import { MobileProductComponent } from './components/mobile-product/mobile-product.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import {AddToCardConfirmComponent} from './components/add-to-card-confirm/add-to-card-confirm.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DialogModule} from 'primeng/dialog';
import { SharedModule } from '../../shared/shared.module';
import {JwSocialButtonsModule} from 'jw-angular-social-buttons';

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
    NgxMdModule.forRoot(),
    MatExpansionModule,
    SwiperModule,
    MatDialogModule,
    FlexLayoutModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    DialogModule,
    MatTooltipModule,
    SharedModule,
    JwSocialButtonsModule,
  ],
  declarations: [
    DesktopProductComponent,
     ProductComponent,
    MobileProductComponent,
    AddToCardConfirmComponent,
  ],
  entryComponents: [AddToCardConfirmComponent],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})
export class ProductModule { }
