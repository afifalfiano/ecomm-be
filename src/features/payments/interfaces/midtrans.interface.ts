export interface ItemDetailsMidtrans {
  item_id: string;
  price: number;
  quantity: number;
  name: string;
}

export interface CreateTransactionMidtrans {
  id: number;
  total_price: number;
  email: string;
  fullname: string;
  item_details: ItemDetailsMidtrans[];
}


export interface MidtransSignatureBody {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
}