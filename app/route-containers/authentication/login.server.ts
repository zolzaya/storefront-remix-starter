import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from '@remix-run/server-runtime';
import { validationError } from "remix-validated-form";
import { login } from '~/providers/account/account';
import { loginValidator } from "~/validators";

export const action = async ({ request }: ActionArgs) => {
  let [formData] = await Promise.all([
    request.formData(),
  ]);

  const validationResult = await loginValidator.validate(formData);
  if (validationResult.error) return validationError(validationResult.error);

  const formParam = Object.fromEntries(formData);
  
  const email = formParam.email.toString();
  const password = formParam.password.toString();
  const rememberMe = !!formParam.rememberMe;
  const redirectTo = (formParam.redirectTo.toString() || '/account') as string;
  const result = await login(email, password, rememberMe, { request });
  if (result.__typename === 'CurrentUser') {
    return redirect(redirectTo, { headers: result._headers });
  } else {
    return json(result, {
      status: 401,
    });
  }
}
 