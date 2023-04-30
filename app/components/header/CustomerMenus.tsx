import { Menu, Transition } from '@headlessui/react';
import { Form, Link } from '@remix-run/react';
import { Fragment } from 'react';
import { classNames } from '~/utils/class-names';
import { useRootLoader } from '~/utils/use-root-loader';

export function CustomerMenus() {
  const { activeCustomer } = useRootLoader();
  const fullName = `${activeCustomer.activeCustomer?.firstName} ${activeCustomer.activeCustomer?.lastName}`;
  return (
    <Fragment key={activeCustomer.activeCustomer?.id}>
      <div>
        <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="sr-only">Open user menu</span>
          <img
            className="h-6 w-6"
            src={`https://api.dicebear.com/6.x/thumbs/svg?seed=${fullName}&radius=50&backgroundColor=ffdfbf`}
            alt={activeCustomer.activeCustomer?.firstName}
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
         
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a href='#'
                  className={classNames(
                    active ? 'bg-gray-100' : '',
                    'block px-4 py-2 text-sm text-gray-700',
                  )}
                >
                  {fullName}
                </a>
              )}
            </Menu.Item>
          </div>

          <div className="py-1">

            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/account"
                  className={classNames(
                    active ? 'bg-gray-100' : '',
                    'block px-4 py-2 text-sm text-gray-700',
                  )}
                >
                  Профайл
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/account/orders"
                  className={classNames(
                    active ? 'bg-gray-100' : '',
                    'block px-4 py-2 text-sm text-gray-700',
                  )}
                >
                  Захиалга
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/account/addresses"
                  className={classNames(
                    active ? 'bg-gray-100' : '',
                    'block px-4 py-2 text-sm text-gray-700',
                  )}
                >
                  Хаяг
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/account/password"
                  className={classNames(
                    active ? 'bg-gray-100' : '',
                    'block px-4 py-2 text-sm text-gray-700',
                  )}
                >
                  Нууц үг
                </Link>
              )}
            </Menu.Item>
          </div>

          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Form method="post" action="/api/logout">
                  <button
                    role="button"
                    className={classNames(
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700 w-full text-left',
                    )}
                  >
                    Гарах
                  </button>
                </Form>
              )}
            </Menu.Item>
          </div>

        </Menu.Items>
      </Transition>
    </Fragment>
  );
}
