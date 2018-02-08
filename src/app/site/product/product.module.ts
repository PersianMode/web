import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopProductComponent } from './components/desktop-product/desktop-product.component';
import {ProductRouting} from './product.routing';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {SizePickerComponent} from '../../shared/components/size-picker/size-picker.component';
import {MatExpansionModule, MatIconModule, MatTooltipModule} from '@angular/material';
import {MarkdownModule} from 'angular2-markdown';

@NgModule({
  imports: [
    CommonModule,
    ProductRouting,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
    MarkdownModule,
    MatExpansionModule,
  ],
  declarations: [
    DesktopProductComponent,
    SizePickerComponent,
  ]
})
export class ProductModule { }
