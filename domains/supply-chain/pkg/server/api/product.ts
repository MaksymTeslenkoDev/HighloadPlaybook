import {
  GetProductParamsType,
  GetProductResponseType,
} from './schemas/product';

export async function getProduct(
  params: GetProductParamsType,
): Promise<GetProductResponseType> {
    console.log(this.db())
  return {
    name: 'name',
    price: 1020,
    productId: 1,
  };
}

export function product(context: any) {
  return {
    get: getProduct.bind(context),
  }
}
