export enum STATUS {
  default = 1,
  WaitForOnlineWarehouse = 2,
  WaitForInvoice = 3,
  InternalDelivery = 4,
  ReadyToDeliver = 5,
  NotExists = 6,
  Refund = 7,
}
