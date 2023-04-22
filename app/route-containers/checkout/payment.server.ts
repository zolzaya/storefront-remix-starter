import { DataFunctionArgs, redirect } from '@remix-run/server-runtime';
import {
    addPaymentToOrder,
    getEligiblePaymentMethods,
    getNextOrderStates,
    transitionOrderToState
} from '~/providers/checkout/checkout';
import { getActiveOrder } from '~/providers/orders/order';
import { sessionStorage } from '~/servers/session.server';


export async function loader({ params, request }: DataFunctionArgs) {
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

  const { eligiblePaymentMethods } = await getEligiblePaymentMethods({
    request,
  });
  const error = session.get('activeOrderError');
  return {
    eligiblePaymentMethods,
    error,
  };
}


export async function action({ params, request }: DataFunctionArgs) {
  const body = await request.formData();
  const paymentMethodCode = body.get('paymentMethodCode');
  const paymentNonce = body.get('paymentNonce');
  if (typeof paymentMethodCode === 'string') {
    const { nextOrderStates } = await getNextOrderStates({
      request,
    });
    if (nextOrderStates.includes('ArrangingPayment')) {
      const transitionResult = await transitionOrderToState(
        'ArrangingPayment',
        { request },
      );
      if (transitionResult.transitionOrderToState?.__typename !== 'Order') {
        throw new Response('Not Found', {
          status: 400,
          statusText: transitionResult.transitionOrderToState?.message,
        });
      }
    }

    const result = await addPaymentToOrder(
      { method: paymentMethodCode, metadata: { nonce: paymentNonce } },
      { request },
    );
    if (result.addPaymentToOrder.__typename === 'Order') {
      return redirect(
        `/checkout/confirmation/${result.addPaymentToOrder.code}`,
      );
    } else {
      throw new Response('Not Found', {
        status: 400,
        statusText: result.addPaymentToOrder?.message,
      });
    }
  }
}