import { Type, type Static } from '@sinclair/typebox';

// Shipment Schema
export type Shipment = Static<typeof ShipmentSchema>;
export const ShipmentSchema = Type.Object({
  shipment_id: Type.Number(),
  order_id: Type.Number(),
  warehouse_id: Type.Number(),
  shipment_date: Type.String({ format: 'date-time' }),
  delivery_date: Type.Optional(Type.String({ format: 'date-time' })),
  status: Type.Union([
    Type.Literal('In Transit'),
    Type.Literal('Delivered'),
    Type.Literal('Returned'),
  ]),
});
