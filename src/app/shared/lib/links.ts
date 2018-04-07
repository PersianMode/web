import {AccessLevel} from '../enum/accessLevel.enum';

export let links : any[] = [
  {address: '/agent/collections', access: AccessLevel.ContentManager},
  {address: '/agent/products', access: AccessLevel.ContentManager},
  {address: '/agent/pages', access: AccessLevel.ContentManager},
  {address: '/agent/uploads', access: AccessLevel.ContentManager},
  {address: '/agent/orders', access: AccessLevel.SalesManager},
];

