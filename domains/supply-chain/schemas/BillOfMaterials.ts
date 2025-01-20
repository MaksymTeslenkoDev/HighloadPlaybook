import { Type, type Static } from '@sinclair/typebox';

// Bill of Materials Schema
export type BillOfMaterials = Static<typeof BillOfMaterialsSchema>;
export const BillOfMaterialsSchema = Type.Object({
  bom_id: Type.Number(),
  finished_product_id: Type.Number(),
  component_product_id: Type.Number(),
  quantity_required: Type.Number(),
});
