function getProduct(context: app.Sandbox) {
  return async (params: {
    productId: number;
  }): Promise<{ productId: number }> => {
    console.log(await context.api.auth.login());
    console.log(context.common.hashPassword('password'));
    return {
      productId: 1,
    };
  };
}

export default function product(sandbox: app.Sandbox) {
  return {
    get: getProduct(sandbox),
  };
}
