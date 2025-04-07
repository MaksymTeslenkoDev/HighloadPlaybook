import { Type } from '@sinclair/typebox';
import { ProductSchema } from '../../../../schemas/Product';
const GetProductParams = Type.Object({
  productId: Type.Number(),
});

const GetProductResponse = ProductSchema;

export default {
  get: {
    params: GetProductParams,
    returns: GetProductResponse,
  },
};
