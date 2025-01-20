import { Type, type Static } from '@sinclair/typebox';

// Product Schema
export type Product = Static<typeof ProductSchema>;
export const ProductSchema = Type.Object({
  product_id: Type.Number(),
  name: Type.String(),
  category: Type.Optional(Type.String()),
  supplier_id: Type.Optional(Type.Number()),
  price: Type.Number(),
  is_finished_product: Type.Boolean(),
  created_at: Type.String({ format: 'date-time' }),
});
