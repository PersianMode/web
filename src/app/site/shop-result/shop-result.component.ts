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
import {CheckoutWarningConfirmComponent} from '../checkout/checkout-warning-confirm/checkout-warning-confirm.component';

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
  payResult: any = null;
  changeMessage: string = '';
  soldOuts: any[] = [];
  discountChanges: any[];
  priceChanges: any[];

  constructor(private router: Router, private route: ActivatedRoute,
              private httpService: HttpService, private cartService: CartService,
              private spinnerService: SpinnerService, private checkoutService: CheckoutService,
              private authService: AuthService, private productService: ProductService) {
  }

  ngOnInit() {
    this.spinnerService.enable();
    this.cartService.loadCartsForShopRes();
    this.route.queryParams.subscribe(params => {
      this.bankReferData = {
        tref: params.tref,
        invoiceNumber: params.iN,
        invoiceDate: params.iD,
        xmlToNodeReadRes: null,
      };
    });


    this.checkoutService.readPayResult(this.bankReferData)
      .then((res: any) => {
        console.log('Pay Result :', res);
        this.payResult = res.resultObj;
        this.bankReferData.xmlToNodeReadRes = this.payResult;
        this.jalali_date = dateFormatter(this.payResult.invoiceDate[0]);
        this.persian_trefId = this.payResult.transactionReferenceID[0].split('').map(ch => (+ch).toLocaleString('fa')).join('');
        if (this.payResult.result[0] === 'False') {
          this.spinnerService.disable();
          return Promise.reject('Un Successful Shop/Return Shop');
        } else if (this.payResult.result[0] === 'True') {
          if (this.payResult.action[0] === '1003') {
            // should final check and verify shop proccess if final check result is valid(no error , no warning)
            this.cartService.cartItems.subscribe(carts => {
              const productIds = [];
              carts.forEach(p => productIds.push(p.product_id));
              return this.productService.loadProducts(productIds)
                .then((data: any[]) => {
                  this.products = [];
                  carts.forEach(p => {
                    const item = {};
                    const product: any = data.filter(e => e._id === p.product_id)[0];
                    const instance = product.instances.filter(i => i._id === p.instance_id)[0];
                    const color = product.colors.filter(c => c._id === instance.product_color_id)[0];
                    const instances = [];
                    product.instances.forEach(ins => {
                      const newIncatnce = {
                        'price': ins.price,
                        'size': ins.size,
                        'instance_id': ins._id
                      };
                      newIncatnce['quantity'] = 0;
                      ins.inventory.forEach(inventory => newIncatnce['quantity'] += inventory.count - inventory.reserved);
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

                  return this.finalCheckItems();
                })
                .then((finalCheckData: any) => {
                  if (this.changeMessage) {
                    console.log(finalCheckData);
                  } else {
                    this.bankReferData.amount = this.payResult.amount[0];
                    return this.httpService.post('verifyTransaction', this.bankReferData)
                      .subscribe(verifyRes => {
                          if (verifyRes.actionResult.result[0] === 'True') {
                            localStorage.removeItem('address');
                            this.cartService.emptyCart();
                            this.spinnerService.disable();
                          } else if (verifyRes.actionResult.result[0] === 'False') {
                            this.cartService.loadCartsForShopRes();
                            this.spinnerService.disable();
                            return Promise.reject('Verify Failed');
                          }
                        },
                        err => {
                          console.log('ERR : ', err);
                          this.resultObj = err.error.resultObj;
                          this.cartService.loadCartsForShopRes();
                          this.spinnerService.disable();
                          return Promise.reject(err);
                        });
                  }
                })
                .catch(err => {
                  console.error(err);
                  this.spinnerService.disable();
                  return Promise.reject(err);
                });
            });
          }
        }
      })
      .catch(err => {
        console.log('ERR : ', err);
        this.payResult = err.error.resultObj;
        this.cartService.loadCartsForShopRes();
        this.spinnerService.disable();
      });
  }

  finalCheckItems() {
    return new Promise((resolve, reject) => {
      this.checkoutService.finalCheck().subscribe(res => {
          console.log('Final check res : ', res);
          this.soldOuts = res.filter(x => x.errors && x.errors.length && x.errors.includes('soldOut'));
          this.discountChanges =
            res.filter(x => x.warnings && x.warnings.length && x.warnings.includes('discountChanged'));
          this.priceChanges = res.filter(x => x.warnings && x.warnings.length && x.warnings.includes('priceChanged'));
          if ((this.soldOuts && this.soldOuts.length) ||
            (this.discountChanges && this.discountChanges.length) ||
            (this.priceChanges && this.priceChanges.length)) {
            this.changeMessage = '';

            if (!!this.soldOuts && !!this.soldOuts.length)
              this.changeMessage = 'متاسفانه برخی از محصولات به پایان رسیده اند';
            else if (this.discountChanges && this.discountChanges.length)
              this.changeMessage = 'برخی از تخفیف ها تغییر کرده است';
            else if (this.priceChanges && this.priceChanges.length)
              this.changeMessage = 'برخی از قیمت ها تغییر کرده است';

            this.productService.updateProducts(res);

            if (this.changeMessage) {
              reject(this.changeMessage);
            } else {
              resolve(res);
            }
          }
          resolve(res);
        },
        err => {
          console.error(err);
          reject(err);
        });
    });
  }

  makePersianNumber(a: string) {
    if (isNaN((+a)))
      return a;
    return (+a).toLocaleString('fa', {useGrouping: false});
  }
}


