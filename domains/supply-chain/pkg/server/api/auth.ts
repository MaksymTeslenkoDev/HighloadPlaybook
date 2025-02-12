

export async function login(
): Promise<string> {
  return "login";
}

export default function auth(sandbox: any) {
  return {
    login: login.bind(sandbox),
  };
}
