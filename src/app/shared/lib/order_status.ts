import {STATUS} from '../enum/status.enum';

export let OrderStatus: any[] = [
  {name: 'تایید پرداخت', title: 'تایید پرداخت', status: STATUS.default},
  {name: 'انتظار تایید انبار آنلاین', title: 'در حال پردازش', status: STATUS.WaitForOnlineWarehouse},
  {name: 'انتظار صدور فاکتور', title: 'در حال پردازش', status: STATUS.WaitForInvoice},
  {name: 'صدور فاکتور', title: 'در حال پردازش', status: STATUS.Invoice},
  {name: 'آماده تحویل', title: 'آماده تحویل', status: STATUS.ReadyToDeliver},
];
