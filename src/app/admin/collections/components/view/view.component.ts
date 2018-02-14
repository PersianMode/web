import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../shared/services/auth.service";
import {ProgressService} from "../../../../shared/services/progress.service";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  collectionId: string;
  currentCollection;

  constructor(private route: ActivatedRoute, private router: Router,
              private authService: AuthService, private progressService: ProgressService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        this.collectionId = params['id']? params['id'] : null;

        this.currentCollection = [];
        this.searchProducts();
      }
    )
  }

  searchProducts() {
    this.progressService.enable();
    this.authService.getOneCollection(this.collectionId).subscribe(
      (data) => {
        data = data.body[0];
        this.currentCollection = data;
        this.currentCollection['_id'] = data['collection']['_id'];
        this.currentCollection['name'] = data['collection']['name'];
        this.currentCollection['image_url'] = data['collection']['image_url'];

        if(this.currentCollection.products)
          if(this.currentCollection.products.length == 1)
            if(!this.currentCollection.products[0]._id)
              delete this.currentCollection.products;

        this.progressService.disable();
      },
      (err) => {
        console.log("Collection not found! ", err);
        this.progressService.disable();
      }
    )
  }

  addProduct(expObj) {
    this.authService.addProductToCollection(this.currentCollection._id, expObj._id).subscribe(
      data => {
        this.searchProducts();
      }, err => {
        console.log("couldn't add product", err);
      }
    );
  }

  viewProduct(pid) {
    this.router.navigate([`/agent/products/${pid}`]);
  }

  removeProduct(pid) {
    this.authService.deleteProductFromCollection(this.collectionId, pid).subscribe(
      (data) => {
        this.searchProducts();
      });
  }

}
