import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule,
  MatPaginatorModule, MatSelectModule,
  MatSnackBarModule, MatTabsModule, MatDividerModule, MatRadioModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {CampaignInfoComponent} from './components/campaign-info/campaign-info.component';
import {CampaignsComponent} from './campaigns.component';
import {CampaignRouting} from './campaign.routing';

@NgModule({
  declarations: [
    CampaignsComponent,
    CampaignInfoComponent
  ],
  imports: [
    CampaignRouting,
    SharedModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    SharedModule,
    MatCheckboxModule,
    MatDividerModule,
    MatPaginatorModule
  ]
})
export class  CampaignModule {
}
