import { Type, type Static } from '@sinclair/typebox';

// Inventory Schema
export type Inventory = Static<typeof InventorySchema>;
export const InventorySchema = Type.Object({
  inventory_id: Type.Number(),
  warehouse_id: Type.Number(),
  product_id: Type.Number(),
  quantity: Type.Number(),
  last_update: Type.String({ format: 'date-time' }),
});
