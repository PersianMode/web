import {AccessLevel} from '../enum/accessLevel.enum';

const AccessTypes: any[] = [
  {name: 'نماینده انبار', level: AccessLevel.ShopClerk},
  {name: 'مسئول تجمیع', level: AccessLevel.HubClerk},
  {name: 'پیک انتقال داخلی', level: AccessLevel.InternalDelivery},
  {name: 'پیک انتقال خارجی', level: AccessLevel.Delivery},

];

export {
  AccessTypes
}



