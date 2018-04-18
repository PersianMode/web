import {STATUS} from '../enum/status.enum';

export let OrderStatus: any[] = [
  {name: 'تایید پرداخت', status: STATUS.default},
  {name: 'ارجاع به فروشگاه', status: STATUS.SMAssignToWarehouse},
  {name: 'بازگشت هزینه', status: STATUS.SMRefund},
  {name: 'عدم تایید فروشگاه', status: STATUS.SCDeclined},
  {name: 'ارسال از فروشگاه به مرکز', status: STATUS.SCSentToCentral},
  {name: 'صدور فاکتور', status: STATUS.Invoice},
  {name: 'آماده تحویل', status: STATUS.ReadyToDeliver},
  {name: 'در حال ارسال', status: STATUS.OnDelivery},
  {name: 'ارسال موفق', status: STATUS.DeliverySuccess},
  {name: 'ارسال ناموفق', status: STATUS.DeliveryFailed},
  {name: 'لغو', status: STATUS.Cancel},
  {name: 'استرداد', status: STATUS.Return},

];
