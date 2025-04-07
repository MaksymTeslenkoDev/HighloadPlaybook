function getProduct(context: app.Sandbox) {
  return async (params: { productId: number }) => {
    console.log(await context.api.auth.login());
    console.log(context.common.hashPassword('password'));
    return await context.db
      .selectFrom('Product')
      .where('Product.product_id', '=', params.productId)
      .selectAll()
      .execute();
  };
}

export default function product(sandbox: app.Sandbox) {
  return {
    get: getProduct(sandbox),
  };
}
