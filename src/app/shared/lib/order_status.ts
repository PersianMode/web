import {STATUS} from '../enum/status.enum';

export let OrderStatus: any[] = [
  {name: 'تایید پرداخت', status: STATUS.default},
  {name: 'انتظار تایید انبار آنلاین', status: STATUS.WaiteForOnlineWarehouse},
  {name: 'انتظار صدور فاکتور', status: STATUS.WaitForInvoice},
  {name: 'صدور فاکتور', status: STATUS.Invoice},
  {name: 'آماده تحویل', status: STATUS.ReadyToDeliver},
];
