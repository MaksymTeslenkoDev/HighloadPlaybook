import { Insertable } from 'kysely';
import { APP_ERROR_CODES, ServerError } from '../src/error';
import { DB } from '../../../schemas/db/db';

function getProduct(context: app.Sandbox) {
  return async (params: { productId: number }) => {
    const product = await context.db
      .selectFrom('Product')
      .where('Product.product_id', '=', params.productId)
      .selectAll()
      .executeTakeFirst();

    if (!product)
      throw new ServerError('Product not found', APP_ERROR_CODES.ClientError);
    return product;
  };
}

function addProduct(context: app.Sandbox) {
  return async (params: Insertable<DB['Product']>) => {
    await context.db.insertInto('Product').values(params).execute();
    const product = await context.db
      .selectFrom('Product')
      .where('Product.name', '=', params.name)
      .select(['product_id'])
      .executeTakeFirst();
    if (!product)
      throw new ServerError('Product not found', APP_ERROR_CODES.SystemError);
    return { productId: product.product_id };
  };
}

export default function product(sandbox: app.Sandbox) {
  return {
    get: getProduct(sandbox),
    add: addProduct(sandbox),
  };
}
