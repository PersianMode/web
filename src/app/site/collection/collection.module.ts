import {NgModule} from '@angular/core';
import { MainCollectionComponent } from './components/main-collection/main-collection.component';
import { LeafCollectionComponent } from './components/leaf-collection/leaf-collection.component';
import { ParentCollectionComponent } from './components/parent-collection/parent-collection.component';
import {CollectionRouting} from './collection.routing';
import {CommonModule} from '@angular/common';
import {FilteringPanelComponent} from '../../shared/components/filtering-panel/filtering-panel.component';
import {ProductGridItemComponent} from '../../shared/components/product-grid-item/product-grid-item.component';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [
    MainCollectionComponent,
    LeafCollectionComponent,
    ParentCollectionComponent,
    FilteringPanelComponent,
    ProductGridItemComponent,
  ],
  imports: [
    CollectionRouting,
    CommonModule,
    SharedModule,
  ],
})
export class CollectionModule {
}
