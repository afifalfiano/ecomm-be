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
