import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {FlexLayoutModule} from '@angular/flex-layout';
import {PageRouting} from './page.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {PageComponent} from './page.component';
import {PageBasicInfoComponent} from './components/page-basic-info/page-basic-info.component';
import {PlacementComponent} from './components/placement/placement.component';
import {MenuPlacementComponent} from './components/menu-placement/menu-placement.component';
import {LogoListPlacementComponent} from './components/logo-list-placement/logo-list-placement.component';
import {SliderPlacementComponent} from './components/slider-placement/slider-placement.component';
import {PageContentPlacementComponent} from './components/page-content-placement/page-content-placement.component';
import {DragulaModule} from 'ng2-dragula';
import {TopMenuComponent} from './components/menu-placement/top-menu/top-menu.component';
import {SubMenuComponent} from './components/menu-placement/sub-menu/sub-menu.component';
import {SliderPreviewComponent} from './components/slider-placement/slider-preview/slider-preview.component';
import {EditPanelComponent} from './components/page-content-placement/edit-panel/edit-panel.component';
import {ColorPickerModule} from 'primeng/primeng';
import {AppSubMenuComponent} from './components/menu-placement/app-sub-menu/app-sub-menu.component';
import {UploadImageDialogComponent} from './components/menu-placement/upload-image-dialog/upload-image-dialog.component';
import {EditorModule} from 'primeng/editor';
import {FooterPlacementComponent} from './components/footer-placement/footer-placement.component';
import {AppFeedPlacementComponent} from './components/app-feed-placement/app-feed-placement.component';

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
    SliderPreviewComponent,
    EditPanelComponent,
    AppSubMenuComponent,
    UploadImageDialogComponent,
    FooterPlacementComponent,
    AppFeedPlacementComponent,
  ],
  imports: [
    PageRouting,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTabsModule,
    MatCheckboxModule,
    SharedModule,
    EditorModule,
    DragulaModule,
    ColorPickerModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  entryComponents: [
    EditPanelComponent,
    UploadImageDialogComponent,
  ],
})
export class PageModule {
}
