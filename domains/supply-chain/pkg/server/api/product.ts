import { Type, type Static } from '@sinclair/typebox';

const getProduct =
  (context: app.Sandbox) =>
  async (params: GetProductParamsType): Promise<GetProductResponseType> => {
    console.log(await context.api.auth.login());
    console.log(context.common.hashPassword("password"));
    return {
      productId: 1,
    };
  };

export default function product(sandbox: app.Sandbox) {
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
