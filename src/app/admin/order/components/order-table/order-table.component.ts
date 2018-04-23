import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MatSort, MatSortable, MatTableDataSource, MatPaginator } from '@angular/material';
import { OrderService } from '../../order.service';

@Component({
    selector: 'app-order-table',
    templateUrl: './order-table.component.html',
    styleUrls: ['./order-table.component.css']
})

export class OrderTableComponent implements OnInit {

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource;
    displayedColumns = ['id', 'time', 'product_name', 'color', 'size',
     'is_collect', 'barcode', 'price', 'customer_name', 'address', 'status'];

    resultsLength = 0;
    constructor(private orderServie: OrderService) { }

    ngOnInit() {
        this.orderServie.getOrder().subscribe(results => {
            this.resultsLength = results.length;
            if (!results) {
                return;
            }
            this.dataSource = new MatTableDataSource(results);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }
}

