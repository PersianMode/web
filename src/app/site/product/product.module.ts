import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopProductComponent } from './components/desktop-product/desktop-product.component';
import {ProductRouting} from './product.routing';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {SizePickerComponent} from "../../shared/components/size-picker/size-picker.component";
import {MatIconModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    ProductRouting,
    MatButtonToggleModule,
    MatIconModule,
  ],
  declarations: [
    DesktopProductComponent,
    SizePickerComponent,
  ]
})
export class ProductModule { }
