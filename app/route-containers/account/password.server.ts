
import { DataFunctionArgs, json } from '@remix-run/server-runtime';
import { validationError } from 'remix-validated-form';
import { updateCustomerPassword } from '~/providers/account/account';
import { customerChangePasswordValidator } from '~/validators';

export async function action({ request }: DataFunctionArgs) {
  const body = await request.formData();

  const result = await customerChangePasswordValidator.validate(body);
  if (result.error) {
    return validationError(result.error);
  }

  const { currentPassword, newPassword } = result.data;

  const res = await updateCustomerPassword(
    { currentPassword, newPassword },
    { request },
  );

  if (res.__typename !== 'Success') {
    return json(res, { status: 401 });
  }

  return json(res);
}