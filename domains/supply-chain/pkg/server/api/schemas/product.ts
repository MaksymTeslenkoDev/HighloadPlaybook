import { Type, Static } from '@sinclair/typebox';

export const GetProductParams = Type.Object({
  productId: Type.Number(),
});

export const GetProductResponse = Type.Object({
  productId: Type.Number(),
  name: Type.String(),
  price: Type.Number(),
});

export type GetProductParamsType = Static<typeof GetProductParams>;
export type GetProductResponseType = Static<typeof GetProductResponse>;

export const product = {
  get: {
    params: GetProductParams,
    returns: GetProductResponse,
  },
};
