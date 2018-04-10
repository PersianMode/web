import {STATUS} from '../enum/status.enum';

export let OrderStatus: any[] = [
  {name: 'تایید پرداخت', status: STATUS.default},
  {name: 'ارجاع به فروشگاه', status: STATUS.SMAssignToWarehouse},
  {name: 'بازگشت هزینه', status: STATUS.SMRefund},
  {name: 'تایید فروشگاه', status: STATUS.SCAccepted},
  {name: 'عدم تایید فروشگاه', status: STATUS.SCDeclined},
  {name: 'صدور فاکتور', status: STATUS.Invoice},
  {name: 'در حال ارسال', status: STATUS.OnDelivery},
  {name: 'ارسال موفق', status: STATUS.DeliverySuccess},
  {name: 'ارسال ناموفق', status: STATUS.DeliveryFailed},
  {name: 'لغو', status: STATUS.Cancel},
  {name: 'استرداد', status: STATUS.Return},

];
