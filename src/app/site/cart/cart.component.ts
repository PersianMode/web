import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {WINDOW} from '../../shared/services/window.service';
import {CartService} from '../../shared/services/cart.service';
import {AuthService} from '../../shared/services/auth.service';
import {priceFormatter} from '../../shared/lib/priceFormatter';
import {GenDialogComponent} from '../../shared/components/gen-dialog/gen-dialog.component';
import {Router} from '@angular/router';
import {DialogEnum} from '../../shared/enum/dialog.components.enum';
import {MatDialog} from '@angular/material';
import {TitleService} from '../../shared/services/title.service';
import {ProductService} from '../../shared/services/product.service';
import {CheckoutService} from '../../shared/services/checkout.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  products = [];
  numberOfProducts: any;
  totalPrice: any;
  discountValue: any;
  dialogEnum = DialogEnum;
  subs: any;
  isLoggedIn = false;
  valid = [];
  disabled = false;
  showWaitingSpinner = false;

  constructor(@Inject(WINDOW) private window, private cartService: CartService, private checkoutService: CheckoutService,
              private authService: AuthService, private router: Router, public dialog: MatDialog,
              private titleService: TitleService, private productService: ProductService) {
  }

  ngOnInit() {
    this.titleService.setTitleWithConstant('سبد خرید');
    this.authService.isLoggedIn.subscribe(
      (data) => this.isLoggedIn = this.authService.userIsLoggedIn()
    );

    this.showHideSpinner(true);
    this.subs = this.cartService.cartItems.subscribe(carts => {
      const productIds = [];
      carts.forEach(p => productIds.push(p.product_id));
      const prevProductCount = this.products.length;
      this.productService.loadProducts(productIds).then((data: any[]) => {
        this.products = [];
        carts.forEach(p => {
          const item = {};
          const product = data.filter(e => e._id === p.product_id)[0];
          const instance = product.instances.find(i => i._id === p.instance_id) || {inventory: []};
          const color = product.colors.find(c => c._id === instance.product_color_id) || {image: {}};
          const instances = [];
          product.instances.forEach(inst => {
            const newInstance = {
              'price': inst.price,
              'size': inst.size,
              'instance_id': inst._id
            };
            newInstance['quantity'] = 0;
            inst.inventory.forEach(inventory => newInstance['quantity'] += inventory.count - inventory.reserved);
            instances.push(newInstance);
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
          item['size'] = instance.size || 'نامشخص';
          item['tags'] = product.tags;
          item['thumbnail'] = color.image.thumbnail;
          item['type'] = product.type;
          item['_id'] = p.instance_id;
          this.products.push(item);
        });
        if (this.products)
          this.checkoutService.setProductData(this.products);
        if (this.products.length > 0) {
          this.numberOfProducts = priceFormatter(this.products.map(el => el.quantity).reduce((a, b) => a + b));
          this.totalPrice = this.checkoutService.calculateTotal();
          this.calculateDiscount();
        } else if (prevProductCount) {
          this.router.navigate(['/']);
        }
        this.showHideSpinner(false);
      }).catch(err => {
        console.error('error in getting cart items: ', err);
        this.showHideSpinner(false);
      });
    });
  }

  goToRegister() {
    if (this.window.innerWidth >= 960) {
      this.dialog.open(GenDialogComponent, {
        width: '500px',
        data: {
          componentName: this.dialogEnum.register,
        }
      });
    } else {
      this.router.navigate(['register']);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  updateProduct(data, currentProduct) {
    switch (data.type) {
      case 'delete': {
        this.cartService.removeItem({instance_id: currentProduct.instance_id, product_id: currentProduct.product_id});
      }
        break;
      case 'update': {
        if (!data.value.newQuantity)
          return;

        const tempInstance = currentProduct.instances.find(el => el.size === data.value.newSize);

        this.cartService.updateItem({
          pre_instance_id: currentProduct.instance_id,
          instance_id: tempInstance ? (tempInstance.instance_id || tempInstance._id) : currentProduct.instance_id,
          product_id: currentProduct.product_id,
          number: data.value.newQuantity,
        });
      }
        break;
    }
  }

  calculateDiscount(considerCoupon = false) {
    this.discountValue = this.cartService.calculateDiscount(this.products, considerCoupon);
  }

  changeValidation(isValid, i) {
    this.valid[i] = isValid;
    this.disabled = !this.valid.reduce((x, y) => x && y, true);
  }

  showHideSpinner(shouldShow = false) {
    this.showWaitingSpinner = shouldShow;
  }
}
