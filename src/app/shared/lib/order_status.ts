import {STATUS} from '../enum/status.enum';

export let OrderStatus: any[] = [
  {name: 'تایید پرداخت', title: 'تایید پرداخت', status: STATUS.default},
  {name: 'انتظار تایید انبار آنلاین', title: 'در حال پردازش', status: STATUS.WaitForOnlineWarehouse},
  {name: 'انتظار تجمیع', title: 'در حال پردازش', status: STATUS.WaitForAggregation},
  {name: 'آماده صدور فاکتور', title: 'در حال پردازش', status: STATUS.ReadyForInvoice},
  {name: 'در انتظار صدور فاکتور', title: 'در حال پردازش', status: STATUS.WaitForInvoice},
  {name: 'تایید فاکتور', title: 'در حال پردازش', status: STATUS.InvoiceVerified},
  {name: 'آماده تحویل', title: 'آماده تحویل', status: STATUS.ReadyToDeliver},
  {name: 'تعیین ارسال', title: 'آماده تحویل', status: STATUS.DeliverySet},
  {name: 'در حال ارسال', title: 'در حال ارسال', status: STATUS.OnDelivery},
  {name: 'تحویل شده', title: 'تحویل شده', status: STATUS.Delivered},
  {name: 'ناموجود', title: 'ناموجود', status: STATUS.NotExists},
  {name: 'بازگشت هزینه', title: 'بازگشت هزینه', status: STATUS.Refund},
  {name: 'بازگشت کالا', title: 'بازگشت کالا', status: STATUS.Return},
  {name: 'لغو سفارش', title: 'لغو سفارش', status: STATUS.CustomerCancel},
  {name: 'ّعدم موجودی نهایی', title: 'بررسی توسط مسئول فروش', status: STATUS.StoreCancel}, 
];

