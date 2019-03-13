import {RouterModule, Routes} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {AppTrackListComponent} from './app-tracklist.component';

const AppTrackList_ROUTES: Routes = [
  {path: '', component: AppTrackListComponent, pathMatch: 'full'},
];

export const AppTrackListRouting = RouterModule.forChild(AppTrackList_ROUTES);
export const AppTrackListTestRouting = RouterTestingModule.withRoutes(AppTrackList_ROUTES);
