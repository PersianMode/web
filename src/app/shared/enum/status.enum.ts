export enum STATUS {
  default= 1,
  WaitForOnlineWarehouse= 2,
  WaitForAggregation= 3,
  ReadyForInternalDelivery= 4,
  OnInternalDelivery= 5,
  Receive= 6,
  WaitForInvoice= 7,
  InvoiceVerified= 8,
  ReadyToDeliver= 9,
  OnDelivery= 10,
  Delivered= 11,
  NotExists= 12,
  Refund= 13,
  Return= 14
}
