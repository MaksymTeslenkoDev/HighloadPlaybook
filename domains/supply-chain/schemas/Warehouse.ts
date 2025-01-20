import { Type, type Static } from '@sinclair/typebox';

// Warehouse Schema
export type Warehouse = Static<typeof WarehouseSchema>;
export const WarehouseSchema = Type.Object({
  warehouse_id: Type.Number(),
  name: Type.String(),
  location: Type.String(),
  capacity: Type.Number(),
  created_at: Type.String({ format: 'date-time' }),
});
