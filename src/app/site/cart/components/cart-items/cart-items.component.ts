import { Component, OnInit } from '@angular/core';
import {priceFormatter} from '../../../../shared/lib/priceFormatter';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.css']
})
export class CartItemsComponent implements OnInit {
  product: any = {
    id: 14,
    name: 'کایری ۳ مدل What The',
    tags: ['کفش', 'بسکتبال', 'نوجوانان'],
    desc: `# راحت
    *کایری ۳ مدل What The* کمک می‌کند به سرعت در هر جهتی حرکت کنید چون پاشنه‌های مدور منحصر به فردی دارد.
     
    * **رنگ نمایش داده شده**: طلائی دانشگاهی/سیاه/زبرجدی تند/آبی نفتی
    * **سبک**: AH2287-700`,
    price: 599000,
    size: 6.5,
    quantity : 3,
    colors: [
      {
        color_id : 101,
        color_name : 'طلائی دانشگاهی/سیاه/زبرجدی تند/آبی نفتی',
        images: {
          thumbnail : '11.jpeg',
          angles : [{
            type: 'video',
            url: 'assets/pictures/products/video.webm',
          },
            {
              url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2.jpg',
            },
            {
              url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_009.jpg',
            },
            {
              url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_019.jpg',
            },
            {
              url: 'assets/pictures/products/kyrie-3-what-the-big-kids-basketball-shoe-NzRVD2_020.jpg',
            }
          ]
        }
      },
    ],
  };
  total_price = null;
  constructor() { }

  ngOnInit() {
    this.total_price = this.product.quantity * this.product.price;
    this.total_price = priceFormatter(this.total_price);
    this.product.price = priceFormatter(this.product.price);
    this.product.size = this.product.size.toLocaleString('fa');
    this.product.quantity = this.product.quantity.toLocaleString('fa');
  }
  deleteProduct() {
  }
  editOrder() {
  }
}
