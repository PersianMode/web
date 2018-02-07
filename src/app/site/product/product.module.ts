import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopProductComponent } from './components/desktop-product/desktop-product.component';
import {ProductRouting} from './product.routing';
import {MatButtonToggleModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ProductRouting,
    MatButtonToggleModule,
  ],
  declarations: [DesktopProductComponent]
})
export class ProductModule { }
