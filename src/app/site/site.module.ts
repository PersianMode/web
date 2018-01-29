import {NgModule} from '@angular/core';
import { HomeComponent } from './home/home.component';
import {SiteRouting, SiteTestRouting} from './site.routing';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    SiteRouting,
    SiteTestRouting,
  ]
})
export class SiteModule {
}
