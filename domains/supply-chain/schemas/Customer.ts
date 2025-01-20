import { Type, type Static } from '@sinclair/typebox';

// Customer Schema
export type Customer = Static<typeof CustomerSchema>;
export const CustomerSchema = Type.Object({
  customer_id: Type.Number(),
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  phone_number: Type.Optional(Type.String()),
  address: Type.Optional(Type.String()),
  created_at: Type.String({ format: 'date-time' }),
});
