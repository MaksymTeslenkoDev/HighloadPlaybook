import { Type, type Static } from '@sinclair/typebox';

// Order Details Schema
export type OrderDetails = Static<typeof OrderDetailsSchema>;
export const OrderDetailsSchema = Type.Object({
  order_detail_id: Type.Number(),
  order_id: Type.Number(),
  product_id: Type.Number(),
  quantity: Type.Number(),
  price: Type.Number(),
  total_price: Type.Number(),
});
