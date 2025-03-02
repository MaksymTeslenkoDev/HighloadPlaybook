const login = (context: common.Context) => async (): Promise<string> => {
  return 'login';
};

export default function auth(sandbox: common.Context) {
  return {
    login: login(sandbox),
  };
}
