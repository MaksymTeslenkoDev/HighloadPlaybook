import { Type, type Static } from '@sinclair/typebox';

// Manufacturing Order Schema
export type ManufacturingOrder = Static<typeof ManufacturingOrderSchema>;
export const ManufacturingOrderSchema = Type.Object({
  manufacturing_order_id: Type.Number(),
  finished_product_id: Type.Number(),
  quantity_to_produce: Type.Number(),
  production_start_date: Type.String({ format: 'date-time' }),
  production_end_date: Type.Optional(Type.String({ format: 'date-time' })),
  status: Type.Union([
    Type.Literal('Pending'),
    Type.Literal('In Progress'),
    Type.Literal('Completed'),
    Type.Literal('Canceled'),
  ]),
});
