import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import { DataFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import { registerCustomerAccount } from '~/providers/account/account';
import { XCircleIcon } from '@heroicons/react/24/solid';
import {
  extractRegistrationFormValues,
  RegisterValidationErrors,
  validateRegistrationForm,
} from '~/utils/registration-helper';
import { ValidatedForm } from 'remix-validated-form';
import { signUpValidator } from '~/validators';
import { Input } from '~/components/Input';
import { SfButton } from '@storefront-ui/react';

export async function action({ params, request }: DataFunctionArgs) {
  const body = await request.formData();
  const fieldErrors = validateRegistrationForm(body);
  if (Object.keys(fieldErrors).length !== 0) {
    return fieldErrors;
  }

  const variables = extractRegistrationFormValues(body);
  const result = await registerCustomerAccount({ request }, variables);
  if (result.__typename === 'Success') {
    return redirect('/sign-up/success');
  } else {
    const formError: RegisterValidationErrors = {
      form: result.errorCode,
    };
    return json(formError, { status: 401 });
  }
}

export default function SignUpPage() {
  const [searchParams] = useSearchParams();
  const formErrors = useActionData<RegisterValidationErrors>();

  return (
    <>
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Бүртгүүлэх
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Эсвэл{' '}
            <Link
              to="/sign-in"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              өөрийн бүртгэлээр нэвтрэх
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <ValidatedForm action="/sign-up" validator={signUpValidator} method='POST' className="space-y-6">
              <input
                type="hidden"
                name="redirectTo"
                value={searchParams.get('redirectTo') ?? undefined}
              />

              <div>
                <Input
                  name="email"
                  label="Имэйл"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="mt-1">
                <Input 
                  name="firstName"
                  label="Нэр"
                  required
                />
              </div>

              <div className="mt-1">
                <Input 
                  name="lastName"
                  label="Овог"
                  required
                />
              </div>

              <div className="mt-1">
                <Input 
                  type="password"
                  name="password"
                  label="Нууц үг"
                  required
                />
              </div>

              <div className="mt-1">
                <Input
                  type="password"
                  name="repeatPassword"
                  label="Баталгаажуулах нууц үг"
                  required
                />
              </div>

              <div className="mt-2">
                <SfButton type="submit" className="w-full">
                  Бүртгүүлэх
                </SfButton>
              </div>

            </ValidatedForm>

          </div>
        </div>
      </div>
    </>
  );
}
