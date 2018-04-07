import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicInfoComponent } from './components/basic-info/basic-info.component';
import {ProfileRouting} from './profile.routing';

@NgModule({
  imports: [
    CommonModule,
    ProfileRouting
  ],
  declarations: [BasicInfoComponent]
})
export class ProfileModule { }
