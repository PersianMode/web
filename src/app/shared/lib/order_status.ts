import {STATUS} from '../enum/status.enum';

export let OrderStatus: any[] = [
  {name: 'تایید پرداخت', title: 'تایید پرداخت', status: STATUS.default},
  {name: 'انتظار تایید انبار آنلاین', title: 'در حال پردازش', status: STATUS.WaitForOnlineWarehouse},
  {name: 'انتظار تجمیع', title: 'در حال پردازش', status: STATUS.WaitForAggregation},
  {name: 'آماده انتقال داخلی', title: 'در حال پردازش', status: STATUS.ReadyForInternalDelivery},
  {name: 'در حال انتقال داخلی', title: 'در حال پردازش', status: STATUS.OnInternalDelivery},
  {name: 'رسید به انبار', title: 'در حال پردازش', status: STATUS.Receive},
  {name: 'آماده صدور فاکتور', title: 'در حال پردازش', status: STATUS.WaitForInvoice},
  {name: 'فاکتور صادر شده', title: 'در حال پردازش', status: STATUS.InvoiceVerified},
  {name: 'آماده تحویل', title: 'آماده تحویل', status: STATUS.ReadyToDeliver},
  {name: 'در حال ارسال', title: 'در حال ارسال', status: STATUS.OnDelivery},
  {name: 'تحویل شده', title: 'تحویل شده', status: STATUS.Delivered},
  {name: 'ناموجود', title: 'ناموجود', status: STATUS.NotExists},
  {name: 'بازگشت هزینه', title: 'بازگشت هزینه', status: STATUS.Refund},
];
