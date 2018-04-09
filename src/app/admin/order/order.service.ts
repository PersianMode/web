import { Order } from './order.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OrderService {
    private serviceUrl = 'assets/orders.json';
    constructor(private http: HttpClient) {}

    getOrder(): Observable<Order[]> {
        return this.http.get<Order[]>(this.serviceUrl);
    }
}

