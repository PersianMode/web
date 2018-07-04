export enum STATUS {
  default = 1,
  WaitForOnlineWarehouse = 2,
  WaitForAggregation = 3,
  ReadyForInvoice = 4,
  WaitForInvoice = 5,
  InvoiceVerified = 6,
  ReadyToDeliver = 7,
  DeliverySet = 8,
  OnDelivery = 9,
  Delivered = 10,
  NotExists = 11,
  Refund = 12,
  Return = 13

}
