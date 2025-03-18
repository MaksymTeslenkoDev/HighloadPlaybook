import { Type } from "@sinclair/typebox";

const login = (context: app.Sandbox) => async (): Promise<string> => {
  return 'login';
};

export default function auth(sandbox: app.Sandbox) {
  return {
    login: login(sandbox),
  };
}

export const LoginParams = Type.Object({
  login: Type.Number(),
  password: Type.String()
});

export const LoginResponse = Type.Object({
  token: Type.String(),
});
