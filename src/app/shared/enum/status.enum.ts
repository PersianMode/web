export enum STATUS {
  default= 1,
  WaitForOnlineWarehouse= 2,
  WaitForAggregation= 3,
  ReadyForInternalDelivery= 4,
  OnInternalDelivery= 5,
  ReadyForInvoice= 6,
  WaitForInvoice= 7,
  InvoiceVerified= 8,
  ReadyToDeliver= 9,
  DeliverySet= 10,
  OnDelivery= 11,
  Delivered= 12,
  NotExists= 13,
  Refund= 13,
  Return= 14
}
