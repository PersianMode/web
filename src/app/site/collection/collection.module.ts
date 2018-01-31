import {NgModule} from '@angular/core';
import { MainCollectionComponent } from './components/main-collection/main-collection.component';
import { LeafCollectionComponent } from './components/leaf-collection/leaf-collection.component';
import { ParentCollectionComponent } from './components/parent-collection/parent-collection.component';
import {CollectionRouting} from './collection.routing';
import {CommonModule} from '@angular/common';
import {FilteringPanelComponent} from '../../shared/components/filtering-panel/filtering-panel.component';
import {WINDOW_PROVIDERS} from '../../shared/services/window.service';

@NgModule({
  declarations: [
    MainCollectionComponent,
    LeafCollectionComponent,
    ParentCollectionComponent,
    FilteringPanelComponent,
  ],
  imports: [
    CollectionRouting,
    CommonModule,
  ],
  providers: [
    WINDOW_PROVIDERS,
  ]
})
export class CollectionModule {
}
