import { useLoaderData, useOutletContext } from '@remix-run/react';
import { DummyPayments } from '~/components/checkout/DummyPayments';
import { ErrorCode, ErrorResult } from '~/generated/graphql';
import { OutletContext } from '~/types';

import { action, loader } from "~/route-containers/checkout/payment.server";
export { action, loader };


export default function CheckoutPayment() {
  const {
    eligiblePaymentMethods,
    error,
  } = useLoaderData();
  const { activeOrderFetcher, activeOrder } = useOutletContext<OutletContext>();

  const paymentError = getPaymentError(error);

  return (
    <div className="flex flex-col items-center divide-gray-200 divide-y">
      {eligiblePaymentMethods.map((paymentMethod: any) =>
        <div className="py-12" key={paymentMethod.id}>
          <DummyPayments
            paymentMethod={paymentMethod}
            paymentError={paymentError}
          />
        </div>
      )}
    </div>
  );
}

function getPaymentError(error?: ErrorResult): string | undefined {
  if (!error || !error.errorCode) {
    return undefined;
  }
  switch (error.errorCode) {
    case ErrorCode.OrderPaymentStateError:
    case ErrorCode.IneligiblePaymentMethodError:
    case ErrorCode.PaymentFailedError:
    case ErrorCode.PaymentDeclinedError:
    case ErrorCode.OrderStateTransitionError:
    case ErrorCode.NoActiveOrderError:
      return error.message;
  }
}
