import { Type } from '@sinclair/typebox';
const GetProductParams = Type.Object({
  productId: Type.Number(),
});

const GetProductResponse = Type.Object({
  productId: Type.Number(),
});

export default {
  get: {
    params: GetProductParams,
    returns: GetProductResponse,
  },
};
