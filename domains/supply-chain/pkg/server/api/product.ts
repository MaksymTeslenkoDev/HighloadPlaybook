import { Type, Static } from '@sinclair/typebox';

export async function getProduct(
  params: GetProductParamsType,
): Promise<GetProductResponseType> {
  console.log(await this.api.auth.login()); 
  return {
    name: 'name',
    price: 1020,
    productId: 1,
  };
}

export default function product(sandbox: any) {
  return {
    get: getProduct.bind(sandbox),
  };
}


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