export enum STATUS {
  default = 1,
  WaitForOnlineWarehouse = 2,
  WaitForInvoice = 3,
  InternalDelivery = 4,
  Receive = 5,
  ReadyToDeliver = 6,
  NotExists = 7,
  Refund = 8,
}
