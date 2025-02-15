import { Type, type Static } from '@sinclair/typebox';

// Bill of Materials Schema
export type BillOfMaterialsType = Static<typeof BillOfMaterials>;
export const BillOfMaterials = Type.Object({
  bom_id: Type.Number(),
  finished_product_id: Type.Number(),
  component_product_id: Type.Number(),
  quantity_required: Type.Number(),
});
