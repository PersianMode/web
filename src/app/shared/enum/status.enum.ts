
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
  Cancel = 13,
  StoreCancel = 14,
  Renew = 15
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
  Cancel = 9,
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
