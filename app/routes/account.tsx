import {
  KeyIcon,
  MapPinIcon,
  ShoppingBagIcon,
  UserCircleIcon
} from '@heroicons/react/24/solid';
import { Link, Outlet, useLocation } from '@remix-run/react';
import { DataFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import { getActiveCustomerDetails } from '~/providers/customer/customer';
import { classNames } from '~/utils/class-names';

const subNavigation = [
  { name: 'Профайл', href: '/account', icon: UserCircleIcon },
  { name: 'Захиалга', href: '/account/orders', icon: ShoppingBagIcon },
  { name: 'Хаяг', href: '/account/addresses', icon: MapPinIcon },
  { name: 'Нууц үг', href: '/account/password', icon: KeyIcon },
]

export async function loader({ request }: DataFunctionArgs) {
  const { activeCustomer } = await getActiveCustomerDetails({ request });
  if (!activeCustomer) {
    return redirect('/sign-in');
  }
  return json({ activeCustomer });
}

export default function AccountDashboard() {
  const location = useLocation();
  return (
    <main className="mx-auto max-w-7xl pb-10 lg:py-12 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
        <aside className="py-6 px-2 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
          <nav className="space-y-1">
            {subNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  item.href === location.pathname
                    ? 'bg-gray-50 text-orange-600 hover:bg-white'
                    : 'text-gray-900 hover:text-gray-900 hover:bg-gray-50',
                  'group rounded-md px-3 py-2 flex items-center text-sm font-medium'
                )}
                aria-current={item.href === location.pathname ? 'page' : undefined}
              >
                <item.icon
                  className={classNames(
                    item.href === location.pathname ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500',
                    'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
