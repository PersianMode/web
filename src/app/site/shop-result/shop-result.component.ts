import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpService} from '../../shared/services/http.service';
import {dateFormatter} from '../../shared/lib/dateFormatter';
import {SpinnerService} from '../../shared/services/spinner.service';
import {CartService} from '../../shared/services/cart.service';
import {AuthService} from '../../shared/services/auth.service';
import {priceFormatter} from '../../shared/lib/priceFormatter';
import {TitleService} from '../../shared/services/title.service';
import {ProductService} from '../../shared/services/product.service';
import {CheckoutService} from '../../shared/services/checkout.service';

@Component({
  selector: 'app-shop-result',
  templateUrl: './shop-result.component.html',
  styleUrls: ['./shop-result.component.css']
})
export class ShopResultComponent implements OnInit {
  products = [];
  bankReferData: any = null;
  resultObj: any = null;
  jalali_date = [];
  persian_trefId = '';

  constructor(private router: Router, private route: ActivatedRoute,
              private httpService: HttpService, private cartService: CartService,
              private spinnerService: SpinnerService, private checkoutService: CheckoutService,
              private authService: AuthService, private productService: ProductService) {
  }

  ngOnInit() {
    const cartItems = null;
    this.spinnerService.enable();
    this.cartService.loadCartsForShopRes();
    this.route.queryParams.subscribe(params => {
      this.bankReferData = {
        tref: params.tref,
        invoiceNumber: params.iN,
        invoiceDate: params.iD,
        cartItems: null,
      };
    });

    this.cartService.cartItems.subscribe( carts => {
      const productIds = [];
      carts.forEach(p => productIds.push(p.product_id));
      return new Promise((resolve, reject) => {
        this.productService.loadProducts(productIds)
          .then((data: any[]) => {
          this.products = [];
          carts.forEach(p => {
            const item = {};
            const product: any = data.filter(e => e._id === p.product_id)[0];
            const instance = product.instances.filter(i => i._id === p.instance_id)[0];
            const color = product.colors.filter(c => c._id === instance.product_color_id)[0];
            const instances = [];
            product.instances.forEach(instance => {
              const newIncatnce = {
                'price': instance.price,
                'size': instance.size,
                'instance_id': instance._id
              };
              newIncatnce['quantity'] = 0;
              instance.inventory.forEach(inventory => newIncatnce['quantity'] += inventory.count - inventory.reserved);
              instances.push(newIncatnce);
            });
            item['base_price'] = product.base_price;
            item['color'] = {
              '_id': color._id,
              'color_id': color.color_id,
              'name': color.name
            };
            item['count'] = 0;
            instance.inventory.forEach(inventory => item['count'] += inventory.count - inventory.reserved);
            item['discount'] = product.discount;
            item['discountedPrice'] = instance.discountedPrice;
            item['instance_id'] = p.instance_id;
            item['instance_price'] = instance.price;
            item['instances'] = instances;
            item['name'] = product.name;
            item['order_id'] = p.order_id;
            item['price'] = instance.price;
            item['product_id'] = p.product_id;
            item['quantity'] = p.quantity;
            item['size'] = instance.size;
            item['tags'] = product.tags;
            item['thumbnail'] = color.image.thumbnail;
            item['type'] = product.type;
            item['_id'] = p.instance_id;
            this.products.push(item);
          });
          if (this.products)
            this.checkoutService.setProductData(this.products);
          this.bankReferData.cartItems = this.checkoutService.prepareCartItemsForShopRes();
          return this.httpService.post('payResult', this.bankReferData)
            .subscribe(res => {
                this.resultObj = res.resultObj;
                if (this.resultObj.result[0] === 'True') {
                  localStorage.removeItem('address');
                  this.cartService.emptyCart();
                } else {
                  this.cartService.loadCartsForShopRes();
                }
                this.jalali_date = dateFormatter(this.resultObj.invoiceDate[0]);
                this.persian_trefId = this.resultObj.transactionReferenceID[0].split('').map(ch => (+ch).toLocaleString('fa')).join('');
                this.spinnerService.disable();
              },
              err => {
                console.log('ERR : ', err);
                this.resultObj = err.error.resultObj;
                this.cartService.loadCartsForShopRes();
                this.spinnerService.disable();
                reject();
              });
        });
      });
      });
  }

  makePersianNumber(a: string) {
    if (isNaN((+a)))
      return a;
    return (+a).toLocaleString('fa', {useGrouping: false});
  }
}
