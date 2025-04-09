import { Type, type Static } from '@sinclair/typebox';
import { ProductSchema } from '../../../../schemas/Product';
const GetProductParams = Type.Object({
  productId: Type.Number(),
});

const GetProductResponse = ProductSchema;

const AddProductParamsSchema = Type.Object({
  name: Type.String(),
  category: Type.Optional(Type.String()),
  supplier_id: Type.Number(),
  price: Type.Number(),
  is_finished_product: Type.Boolean(),
});

const AddProductResponseSchema = Type.Object({
  productId: Type.Number(),
});

export type AddProductParams = Static<typeof AddProductParamsSchema>;
export type AddProductResponse = Static<typeof AddProductResponseSchema>;

export default {
  get: {
    params: GetProductParams,
    returns: GetProductResponse,
  },
  add: {
    params: AddProductParamsSchema,
    returns: AddProductResponseSchema,
  },
};
