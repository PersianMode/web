import {ORDER_LINE_STATUS as ols , ORDER_STATUS as os} from '../enum/status.enum';

const OrderLineStatuses: any[] = [
  {name: 'تایید پرداخت', title: 'تایید پرداخت', status: ols.default},
  {name: 'انتظار تایید انبار آنلاین', title: 'در حال پردازش', status: ols.WaitForOnlineWarehouse},
  {name: 'تایید انبار آنلاین', title: 'در حال پردازش', status: ols.OnlineWarehouseVerified},
  {name: 'آماده تحویل', title: 'آماده تحویل', status: ols.ReadyToDeliver},
  {name: 'تعیین ارسال', title: 'آماده تحویل', status: ols.DeliverySet},
  {name: 'در حال ارسال', title: 'در حال ارسال', status: ols.OnDelivery},
  {name: 'تحویل شده', title: 'تحویل شده', status: ols.Delivered},
  {name: 'دریافت شده', title: 'در حال پردازش', status: ols.Recieved},
  {name: 'اماده بررسی نهایی', title: 'در حال پردازش', status: ols.FinalCheck},
  {name: 'بررسی نهایی موفق', title: 'در حال پردازش', status: ols.Checked},
  {name: 'ناموجود', title: 'ناموجود', status: ols.NotExists},
  {name: 'بازگشت کالا', title: 'بازگشت کالا', status: ols.Return},
  {name: 'لغو سفارش', title: 'لغو سفارش', status: ols.CustomerCancel},
  {name: 'ّعدم موجودی انبار', title: 'بررسی توسط مسئول فروش', status: ols.StoreCancel},
  {name: 'ّاز سر گیری فرایند', title: 'در حال پردازش', status: ols.Renew},
];
const OrderStatuses: any[] = [
  {name: 'در انتظار تجمیع', title: 'در حال آماده سازی', status: os.WaitForAggregation},
  {name: 'در انتظار صدور فاکتور', title: 'صدور فاکتور', status: os.WaitForInvoice},
  {name: 'تایید صدور فاکتور', title: 'صدور فاکتور', status: os.InvoiceVerified},
  {name: 'آماده ارسال', title: 'اماده سازی جهت ارسال', status: os.ReadyToDeliver},
  {name: 'تخصیص ارسال', title: 'در حال آماده سازی', status: os.DeliverySet},
  {name: 'در حال ارسال', title: 'در حال ارسال', status: os.OnDelivery},
  {name: 'تحویل شده', title: 'تحویل شده', status: os.Delivered},
  {name: 'درخواست بازگشت کالا', title: 'درخواست بازگشت کالا', status: os.Return},
  {name: 'لغو', title: 'لغو', status: os.CustomerCancel},
];

export {
  OrderLineStatuses,
  OrderStatuses
}



