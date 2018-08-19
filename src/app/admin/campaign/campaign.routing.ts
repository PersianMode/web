import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {CampaignsComponent} from './campaigns.component';
import {CampaignInfoComponent} from './components/campaign-info/campaign-info.component';

const Campaign_ROUTES: Routes = [
  {path: '', component: CampaignsComponent, pathMatch: 'full'},
  {path: 'campaignInfo/:id', component: CampaignInfoComponent},
  {path: 'campaignInfo', component: CampaignInfoComponent},
];

export const CampaignRouting = RouterModule.forChild(Campaign_ROUTES);
export const CampaignTestRouting = RouterTestingModule.withRoutes(Campaign_ROUTES);
