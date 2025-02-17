import { Type, Static } from '@sinclair/typebox';

const getProduct =
  async (context: common.Context) =>
  async (params: GetProductParamsType): Promise<GetProductResponseType> => {
    console.log(await context.api.auth.login());
    return {
      productId: 1,
    };
  };

export default function product(sandbox: common.Context) {
  return {
    get: getProduct(sandbox),
  };
}

export const GetProductParams = Type.Object({
  productId: Type.Number(),
});

export const GetProductResponse = Type.Object({
  productId: Type.Number(),
});

export type GetProductParamsType = Static<typeof GetProductParams>;
export type GetProductResponseType = Static<typeof GetProductResponse>;
