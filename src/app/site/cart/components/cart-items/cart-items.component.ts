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
    size: '6.5',
    colors: [
      {
        color_id : 101,
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
  price_fa: string = null;
  size_fa: string = null;
  constructor() { }

  ngOnInit() {
    this.price_fa = priceFormatter(this.product.price);
    this.size_fa = this.product.size.toLocaleString('fa');
  }
  deleteProduct() {
  }
  openForm() {
  }
}
