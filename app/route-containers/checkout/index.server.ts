import { DataFunctionArgs, redirect } from '@remix-run/server-runtime';
import {
    getAvailableCountries,
    getEligibleShippingMethods,
} from '~/providers/checkout/checkout';
import { getActiveCustomerAddresses } from '~/providers/customer/customer';
import { getActiveOrder } from '~/providers/orders/order';
import { sessionStorage } from '~/servers/session.server';

export async function loader({ request }: DataFunctionArgs) {
  const session = await sessionStorage.getSession(
    request?.headers.get('Cookie'),
  );

  const activeOrder = await getActiveOrder({ request });
  
  //check if there is an active order if not redirect to homepage
  if (
    !session ||
    !activeOrder ||
    !activeOrder.active ||
    activeOrder.lines.length === 0
  ) {
    return redirect('/');
  }
  const { availableCountries } = await getAvailableCountries({ request });
  const { eligibleShippingMethods } = await getEligibleShippingMethods({
    request,
  });
  const { activeCustomer } = await getActiveCustomerAddresses({ request });
  const error = session.get('activeOrderError');
  return {
    availableCountries,
    eligibleShippingMethods,
    activeCustomer,
    error,
  };
}
