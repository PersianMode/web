
enum ORDER_LINE_STATUS {
  default = 1,
  WaitForOnlineWarehouse = 2,
  WaitForOnlineWarehouseCancel = 3,
  OnlineWarehouseVerified = 4,
  OnlineWarehouseCanceled = 5,
  ReadyToDeliver = 6,
  DeliverySet = 7,
  OnDelivery = 8,
  Delivered = 9,
  Recieved = 10,
  FinalCheck = 11,
  Checked = 12,
  NotExists = 13,
  Return = 14,
  CancelRequested = 15,
  StoreCancel = 16,
  Renew = 17,
  Canceled = 18
}


enum ORDER_STATUS {
  WaitForAggregation = 1,
  WaitForInvoice = 2,
  InvoiceVerified = 3,
  ReadyToDeliver = 4,
  DeliverySet = 5,
  OnDelivery = 6,
  Delivered = 7,
  Return = 8,
  CancelRequested = 9,
  Canceled = 10
}

enum Delivery_STATUS {

  default = 1,
  agentSet = 2,
  requestPackage = 3,
  started = 4,
  ended = 5,
}



export {
  ORDER_LINE_STATUS,
  ORDER_STATUS,
  Delivery_STATUS
};
