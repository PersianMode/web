import {AccessLevel} from '../enum/accessLevel.enum';

export let links: any[] = [
  {address: '/agent/collections', access: [AccessLevel.ContentManager]},
  {address: '/agent/products', access: [AccessLevel.ContentManager]},
  {address: '/agent/campaigns', access: [AccessLevel.ContentManager]},
  {address: '/agent/pages', access: [AccessLevel.ContentManager]},
  {address: '/agent/dictionary', access: [AccessLevel.ContentManager]},
  {address: '/agent/uploads', access: [AccessLevel.ContentManager]},
  {address: '/agent/logistic', access: [AccessLevel.SalesManager, AccessLevel.ShopClerk, AccessLevel.HubClerk]},
  {address: '/agent/deliverycost', access: [AccessLevel.SalesManager]},
  {address: '/agent/soldouts', access: [AccessLevel.ContentManager]},
  {address: '/agent/loyaltygroup', access: [AccessLevel.SalesManager]},
  {address: '/agent/deliverypriority', access: [AccessLevel.SalesManager]},
  {address: '/agent/internal_delivery', access: [AccessLevel.SalesManager]},
  {address: '/agent/deliverycost/free/option', access: [AccessLevel.SalesManager]},
  {address: '/agent/refund_bank', access: [AccessLevel.SalesManager]},
  {address: '/agent/daily_report', access: [AccessLevel.SalesManager]},
  {address: '/agent/app_tracklist', access: [AccessLevel.ContentManager]},
];
