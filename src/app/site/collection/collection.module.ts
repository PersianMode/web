import {NgModule} from '@angular/core';
import { MainCollectionComponent } from './components/main-collection/main-collection.component';
import { LeafCollectionComponent } from './components/leaf-collection/leaf-collection.component';
import { ParentCollectionComponent } from './components/parent-collection/parent-collection.component';
import {CollectionRouting} from './collection.routing';
import {CommonModule} from '@angular/common';
import {FilteringPanelComponent} from '../../shared/components/filtering-panel/filtering-panel.component';
import {ProductGridItemComponent} from '../../shared/components/product-grid-item/product-grid-item.component';
import {SharedModule} from '../../shared/shared.module';
import {VirtualScrollerModule} from 'primeng/virtualscroller';
import {SidebarModule} from 'primeng/sidebar';
import {
  MatButtonModule, MatButtonToggleModule, MatCheckboxModule, MatExpansionModule,
  MatTooltipModule,
  MatProgressSpinnerModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {SliderModule} from 'primeng/slider';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [
    MainCollectionComponent,
    LeafCollectionComponent,
    ParentCollectionComponent,
    FilteringPanelComponent,
    ProductGridItemComponent,
    BreadcrumbComponent,
  ],
  imports: [
    CollectionRouting,
    CommonModule,
    FormsModule,
    SharedModule,
    VirtualScrollerModule,
    SidebarModule,
    MatCheckboxModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    OverlayPanelModule,
    SliderModule,
  ],
})
export class CollectionModule {
}
