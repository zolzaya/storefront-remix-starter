import { ArrowPathIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { Link, useFetcher, useSearchParams } from '@remix-run/react';
import { ValidatedForm } from 'remix-validated-form';
import { ErrorResult } from '~/generated/graphql';
import { Input } from '~/components/Input';

import { action, loader } from "~/route-containers/authentication/login.server";
export { action, loader };

import { loginValidator } from '~/validators';

export default function SignInPage() {
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher<ErrorResult>();

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Нэвтрэх</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Эсвэл{' '}
          <Link
            to="/sign-up"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            шинэ бүртгэл үүсгэх
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ValidatedForm validator={loginValidator} fetcher={fetcher} id="signInForm" method="post">
            <fieldset disabled={fetcher.state !== 'idle'} className="space-y-6">
              <input
                type="hidden"
                name="redirectTo"
                value={searchParams.get('redirectTo') ?? undefined}
              />
              <div>
                <Input
                  label="Имэйл"
                  name="email"
                  required
                  autoComplete="email"
                 />
              </div>

              <div>
                <Input
                  label="Нууц үг"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                    defaultChecked
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Намайг сана
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/password-reset"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Нууц үгээ мартсан уу?
                  </Link>
                </div>
              </div>

              {fetcher.data && fetcher.state === 'idle' && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <XCircleIcon
                        className="h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Алдаа
                      </h3>
                      <p className="text-sm text-red-700 mt-2">
                        Нэвтрэх нэр эсвэл нууц үг буруу байна!
                        {/* {login.data.message} */}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <span className='flex gap-4 items-center'>
                    {fetcher.state !== 'idle' && <ArrowPathIcon className="animate-spin h-5 w-5 text-gray-500" />}
                    Нэвтрэх
                  </span>
                </button>
              </div>
            </fieldset>
          </ValidatedForm>
        </div>
      </div>

    </div>
  );
}
