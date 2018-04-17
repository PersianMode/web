export interface Order {
    id: string;
    time: string;
    product_name: string;
    color: string;
    size: string;
    is_collect: boolean;
    barcode: string;
    price: number;
    customer_name: string;
    address: string;
    status: number;
}
