import {AccessLevel} from '../enum/accessLevel.enum';

export let links: any[] = [
  {address: '/agent/collections', access: [AccessLevel.ContentManager]},
  {address: '/agent/products', access: [AccessLevel.ContentManager]},
  {address: '/agent/campaigns', access: [AccessLevel.ContentManager]},
  {address: '/agent/pages', access: [AccessLevel.ContentManager]},
  {address: '/agent/dictionary', access: [AccessLevel.ContentManager]},
  {address: '/agent/uploads', access: [AccessLevel.ContentManager]},
  {address: '/agent/orders', access: [AccessLevel.SalesManager, AccessLevel.ShopClerk]},
  {address: '/agent/delivery', access: [AccessLevel.SalesManager]},
  {address: '/agent/soldouts', access: [AccessLevel.ContentManager]},
  {address: '/agent/loyaltygroup', access: [AccessLevel.SalesManager]},
  {address: '/agent/delivery', access: [AccessLevel.SalesManager, AccessLevel.ShopClerk]},
];
