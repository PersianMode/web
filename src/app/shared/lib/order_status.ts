import {STATUS} from '../enum/status.enum';

export let OrderStatus: any[] = [
  {name: 'تایید پرداخت', title: 'تایید پرداخت', status: STATUS.default},
  {name: 'انتظار تایید انبار آنلاین', title: 'در حال پردازش', status: STATUS.WaitForOnlineWarehouse},
  {name: 'انتظار صدور فاکتور', title: 'در حال پردازش', status: STATUS.WaitForInvoice},
  {name: 'انتقال داخلی', title: 'در حال پردازش', status: STATUS.InternalDelivery},
  {name: 'ناموجود', title: 'در حال پردازش', status: STATUS.NotExists},
  {name: 'بازگشت هزینه', title: 'بازگشت هزینه', status: STATUS.Refund},
  {name: 'آماده تحویل', title: 'آماده تحویل', status: STATUS.ReadyToDeliver},
];
