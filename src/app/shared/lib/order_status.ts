import {STATUS} from '../enum/status.enum';

export let OrderStatus: any[] = [
  {name: 'تایید پرداخت', title: 'درحال پردازش', status: STATUS.default},
  {name: 'ارجاع به فروشگاه', title: 'درحال پردازش', status: STATUS.SMAssignToWarehouse},
  {name: 'بازگشت هزینه', title: 'بازگشت هزینه', status: STATUS.SMRefund},
  {name: 'عدم تایید فروشگاه', title: 'درحال پردازش', status: STATUS.SCDeclined},
  {name: 'ارسال از فروشگاه به مرکز', title: 'درحال پردازش', status: STATUS.SCSentToCentral},
  {name: 'صدور فاکتور', title: 'درحال پردازش', status: STATUS.Invoice},
  {name: 'آماده تحویل', title: 'درحال پردازش', status: STATUS.ReadyToDeliver},
  {name: 'در حال ارسال', title: 'درحال پردازش', status: STATUS.OnDelivery},
  {name: 'ارسال موفق', title: 'سفارش تحویل شده', status: STATUS.DeliverySuccess},
  {name: 'ارسال ناموفق', title: 'درحال پردازش', status: STATUS.DeliveryFailed},
  {name: 'لغو', title: 'سفارش لغو شده', status: STATUS.Cancel},
  {name: 'استرداد', title: 'بازگشت کالا', status: STATUS.Return},
];
