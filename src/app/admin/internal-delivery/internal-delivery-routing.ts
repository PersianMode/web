import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import { InternalDeliveryComponent } from './internal-delivery.component';


const Internal_Delivery_ROUTES: Routes = [
  {path: '', component: InternalDeliveryComponent, pathMatch: 'full'},
];

export const InternalDeliveryRouting = RouterModule.forChild(Internal_Delivery_ROUTES);
export const InternalDeliveryTestRouting = RouterTestingModule.withRoutes(Internal_Delivery_ROUTES);
