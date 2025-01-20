import { Type, type Static } from '@sinclair/typebox';

// Orders Schema
export type Orders = Static<typeof OrdersSchema>;
export const OrdersSchema = Type.Object({
  order_id: Type.Number(),
  customer_id: Type.Number(),
  order_date: Type.String({ format: 'date-time' }),
  status: Type.Union([
    Type.Literal('Pending'),
    Type.Literal('Shipped'),
    Type.Literal('Delivered'),
    Type.Literal('Canceled'),
  ]),
  customer_amount: Type.Number(),
});
