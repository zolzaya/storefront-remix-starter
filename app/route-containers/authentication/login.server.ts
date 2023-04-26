import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from '@remix-run/server-runtime';
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { login } from '~/providers/account/account';


export const validator = withZod(
  z.object({
    email: z.string().min(1, { message: "Имэйл хоосон байна!" }).email("Имэйл хаяг буруу байна!"),
    password: z.string().min(1, { message: "Нууц үгээ оруулна уу!" }),
  })
);

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();
  const email = body.get('email');
  const password = body.get('password');
  if (typeof email === 'string' && typeof password === 'string') {
    const rememberMe = !!body.get('rememberMe');
    const redirectTo = (body.get('redirectTo') || '/account') as string;
    const result = await login(email, password, rememberMe, { request });
    if (result.__typename === 'CurrentUser') {
      return redirect(redirectTo, { headers: result._headers });
    } else {
      return json(result, {
        status: 401,
      });
    }
  }
}
 