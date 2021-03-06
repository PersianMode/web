import {ORDER_LINE_STATUS as ols, ORDER_STATUS as os, Delivery_STATUS as ds, } from '../enum/status.enum';

const OrderLineStatuses: any[] = [
  {name: 'تایید پرداخت', title: 'تایید پرداخت', status: ols.default},
  {name: 'انتظار تایید انبار آنلاین', title: 'در حال پردازش', status: ols.WaitForOnlineWarehouse},
  {name: 'انتظار لغو سفارش توسط انبار آنلاین', title: 'در حال پردازش', status: ols.WaitForOnlineWarehouseCancel},
  {name: 'تایید انبار آنلاین', title: 'در حال پردازش', status: ols.OnlineWarehouseVerified},
  {name: 'لغو توسط انبار آنلاین', title: 'در حال پردازش', status: ols.OnlineWarehouseCanceled},
  {name: 'آماده تحویل', title: 'آماده تحویل', status: ols.ReadyToDeliver},
  {name: 'تعیین ارسال', title: 'آماده تحویل', status: ols.DeliverySet},
  {name: 'در حال ارسال', title: 'در حال ارسال', status: ols.OnDelivery},
  {name: 'تحویل شده', title: 'تحویل شده', status: ols.Delivered},
  {name: 'دریافت شده', title: 'در حال پردازش', status: ols.Recieved},
  {name: 'اماده بررسی نهایی', title: 'در حال پردازش', status: ols.FinalCheck},
  {name: 'بررسی نهایی موفق', title: 'در حال پردازش', status: ols.Checked},
  {name: 'ناموجود', title: 'ناموجود', status: ols.NotExists},
  {name: 'درخواست بازگشت سفارش', title: 'درخواست بازگشت سفارش', status: ols.ReturnRequested},
  {name: 'انتظار انبار مفقودی', title: 'درخواست بازگشت سفارش', status: ols.WaitForLost},
  {name: 'تایید انبار مفقودی', title: 'درخواست بازگشت سفارش', status: ols.LostVerified},
  {name: 'ّاز سر گیری فرایند', title: 'در حال پردازش', status: ols.Renew},
  {name: 'لغو سفارش', title: 'در حال پردازش', status: ols.Canceled},
  {name: 'خرابی بدون بازگشت هزینه', title: 'در حال پردازش', status: ols.DamageWithoutRefund},
  {name: 'خرابی با بازگشت هزینه', title: 'در حال پردازش', status: ols.DamageWithRefund},
  {name: 'از سرگیری فرایند', title: 'در حال پردازش', status: ols.Renew},
  {name: 'انتظاز تایید بازگشت', title: 'در حال پردازش', status: ols.WaitForReturn},
  {name: 'تایید بازگشت', title: 'در حال پردازش', status: ols.ReturnVerified},
];
const OrderStatuses: any[] = [
  {name: 'در انتظار تجمیع', title: 'در حال آماده سازی', status: os.WaitForAggregation},
  {name: 'در انتظار صدور فاکتور', title: 'صدور فاکتور', status: os.WaitForInvoice},
  {name: 'تایید صدور فاکتور', title: 'صدور فاکتور', status: os.InvoiceVerified},
  {name: 'آماده ارسال', title: 'اماده سازی جهت ارسال', status: os.ReadyToDeliver},
  {name: 'تخصیص ارسال', title: 'در حال آماده سازی', status: os.DeliverySet},
  {name: 'در حال ارسال', title: 'در حال ارسال', status: os.OnDelivery},
  {name: 'تحویل شده', title: 'تحویل شده', status: os.Delivered}
];

const DeliveryStatuses: any[] = [
  {name: 'پیش فرض', title: 'پیش فرض', status: ds.default},
  {name: 'تعیین مسئول ارسال', title: 'تعیین مسئول ارسال', status: ds.agentSet},
  {name: 'درخواست محموله توسط پیک', title: 'درخواست محموله توسط پیک', status: ds.requestPackage},
  {name: 'شروع', title: 'شروع', status: ds.started},
  {name: 'پایان', title: 'پایان', status: ds.ended},

];

export {
  OrderLineStatuses,
  OrderStatuses,
  DeliveryStatuses
}



