import { Type, type Static } from '@sinclair/typebox';

// Supplier Schema
export type Supplier = Static<typeof SupplierSchema>;
export const SupplierSchema = Type.Object({
  supplier_id: Type.Number(),
  supplier_name: Type.String(),
  brand_name: Type.String(),
  support_phone: Type.Optional(Type.String()),
  support_email: Type.String({ format: 'email' }),
  location: Type.Optional(Type.String()),
  created_at: Type.String({ format: 'date-time' }),
});
