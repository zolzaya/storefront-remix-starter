import { ArrowPathIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { Link, useFetcher, useSearchParams } from '@remix-run/react';
import { Button } from '~/components/Button';
import { ErrorResult } from '~/generated/graphql';

import { action } from "~/route-containers/authentication/login.server";
export { action };


export default function SignInPage() {
  const [searchParams] = useSearchParams();
  const login = useFetcher<ErrorResult>();

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
          <login.Form method="post">
            <fieldset disabled={login.state !== 'idle'} className="space-y-6">
              <input
                type="hidden"
                name="redirectTo"
                value={searchParams.get('redirectTo') ?? undefined}
              />
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Имэйл
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    defaultValue="test@vendure.io"
                    placeholder="Имэйл"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:text-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Нууц үг
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Нууц үг"
                    defaultValue="test"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:text-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
                  />
                </div>
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
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Нууц үгээ мартсан уу?
                  </a>
                </div>
              </div>

              {login.data && login.state === 'idle' && (
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
                <Button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className='flex gap-4 items-center'>
                    {login.state !== 'idle' && <ArrowPathIcon className="animate-spin h-5 w-5 text-gray-500" />}
                    Нэвтрэх
                  </span>
                </Button>
              </div>
            </fieldset>
          </login.Form>
        </div>
      </div>

    </div>
  );
}
