import { GetProductParamsType, GetProductResponseType } from './product.schema';

export async function getProduct(
  params: GetProductParamsType,
): Promise<GetProductResponseType> {
  return {
    name: 'name',
    price: 1020,
    productId: 1,
  };
}

export default (context: any) => {
  get: getProduct.bind(context);
};
