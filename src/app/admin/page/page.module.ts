import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule,
  MatPaginatorModule, MatSelectModule,
  MatSnackBarModule, MatTabsModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {PageRouting} from './page.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {PageComponent} from './page.component';
import {PageBasicInfoComponent} from './components/page-basic-info/page-basic-info.component';
import {MarkdownModule} from 'angular2-markdown';
import { PlacementComponent } from './components/placement/placement.component';
import { MenuPlacementComponent } from './components/menu-placement/menu-placement.component';
import { LogoListPlacementComponent } from './components/logo-list-placement/logo-list-placement.component';
import { SliderPlacementComponent } from './components/slider-placement/slider-placement.component';
import { PageContentPlacementComponent } from './components/page-content-placement/page-content-placement.component';
import {DragulaModule} from 'ng2-dragula';
import { TopMenuComponent } from './components/menu-placement/top-menu/top-menu.component';
import { SubMenuComponent } from './components/menu-placement/sub-menu/sub-menu.component';
import { EditPanelComponent } from './components/page-content-placement/edit-panel/edit-panel.component';
import {ColorPickerModule} from 'primeng/primeng';

@NgModule({
  declarations: [
    PageComponent,
    PageBasicInfoComponent,
    PlacementComponent,
    MenuPlacementComponent,
    LogoListPlacementComponent,
    SliderPlacementComponent,
    PageContentPlacementComponent,
    TopMenuComponent,
    SubMenuComponent,
    EditPanelComponent,
  ],
  imports: [
    PageRouting,
    CommonModule,
    MatIconModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTabsModule,
    MatCheckboxModule,
    SharedModule,
    MarkdownModule.forRoot(),
    DragulaModule,
    ColorPickerModule,
  ],
  entryComponents: [
    EditPanelComponent,
  ],
})
export class PageModule {
}
