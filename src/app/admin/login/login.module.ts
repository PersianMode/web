import {NgModule} from '@angular/core';
import {LoginComponent} from './components/login/login.component';
import {LoginRouting} from './login.routing';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    LoginRouting,
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class LoginModule {
}
