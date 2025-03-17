const login = (context: app.Sandbox) => async (): Promise<string> => {
  return 'login';
};

export default function auth(sandbox: app.Sandbox) {
  return {
    login: login(sandbox),
  };
}
