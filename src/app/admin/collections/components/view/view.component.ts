import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpService} from "../../../../shared/services/http.service";
import {AuthService} from "../../../../shared/services/auth.service";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  collectionId: string;
  currentCollection;
  // productList = [];

  constructor(private route: ActivatedRoute, private router: Router,
              private httpService: HttpService, private authService: AuthService) { }

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
    //enable progressive bar
    this.authService.getOneCollection(this.collectionId).subscribe(
      (data) => {
        data = data.body[0];
        this.currentCollection = data;
        this.currentCollection['_id'] = data['collection']['_id'];
        this.currentCollection['name'] = data['collection']['name'];
        this.currentCollection['image_url'] = data['collection']['image_url'];

        //disable progressive bar
      },
      (err) => {
        console.log("Collection not found! ", err);
        //disable progressive bar
      }
    )
  }

  addProduct(expObj) {
    // console.log("GOT!", expObj);
    this.authService.addProductToCollection(this.currentCollection.id, expObj.id);
    this.searchProducts();
  }

  viewProduct(pid) {
    this.router.navigate([`/admin/products/${pid}`]);
  }

  removeProduct(pid) {
    //call DELETE api for /collection/product/:cid/:pid or something like that
    this.authService.deleteProductFromCollection(this.collectionId, pid).subscribe(
      (data) => {

        this.searchProducts();
      });
  }

}
