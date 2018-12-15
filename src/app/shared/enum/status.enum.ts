
enum ORDER_LINE_STATUS {
  default = 1,
  WaitForOnlineWarehouse = 2,
  OnlineWarehouseVerified = 3,
  ReadyToDeliver = 4,
  DeliverySet = 5,
  OnDelivery = 6,
  Delivered = 7,
  Recieved = 8,
  FinalCheck = 9,
  Checked = 10,
  NotExists = 11,
  Return = 12,
  CustomerCancel = 13,
  StoreCancel = 14,
  Renew = 15
}


enum ORDER_STATUS {
  WaitForAggregation = 1,
  ReadyForInvoice = 2,
  WaitForInvoice = 3,
  InvoiceVerified = 4,
  ReadyToDeliver = 5,
  DeliverySet = 6,
  DeliveryReserved = 7,
  OnDelivery = 8,
  Delivered = 9,
  Return = 10,
  CustomerCancel = 11,
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
