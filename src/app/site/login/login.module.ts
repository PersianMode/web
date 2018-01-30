import {NgModule} from '@angular/core';
import {LoginComponent} from './components/login/login.component';
import {LoginRouting} from './login.routing';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    LoginRouting,
    CommonModule,
  ]
})
export class LoginModule {
}
