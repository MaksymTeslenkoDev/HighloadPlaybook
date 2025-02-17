const login = async (context: common.Context) => async (): Promise<string> => {
  console.log(await context.api.auth.login());
  return 'login';
};

export default function auth(sandbox: common.Context) {
  return {
    login: login(sandbox),
  };
}
