import {NgModule} from '@angular/core';
import {LoginComponent} from './components/login/login.component';
import {LoginRouting} from './login.routing';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    LoginRouting,
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ]
})
export class LoginModule {
}
