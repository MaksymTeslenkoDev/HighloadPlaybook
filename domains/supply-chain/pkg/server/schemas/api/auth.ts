// import * as auth from '../../api/auth';
import { Type } from "@sinclair/typebox";

const LoginParams = Type.Object({
  login: Type.Number(),
  password: Type.String()
});
const LoginResponse = Type.Object({
  token: Type.String(),
});


export default {
  login: {
    params: LoginParams,
    returns: LoginResponse,
  },
};
