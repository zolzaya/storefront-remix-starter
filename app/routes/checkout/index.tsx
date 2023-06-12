import { LockClosedIcon } from '@heroicons/react/24/solid';
import {
  useLoaderData,
  useNavigate,
  useOutletContext,
} from '@remix-run/react';
import { FormEvent, useState } from 'react';
import { AddressForm } from '~/components/account/AddressForm';
import { ShippingAddressSelector } from '~/components/checkout/ShippingAddressSelector';
import { ShippingMethodSelector } from '~/components/checkout/ShippingMethodSelector';
import { OutletContext } from '~/types';
import { classNames } from '~/utils/class-names';
import { shippingFormDataIsValid } from '~/utils/validation';
import { SbInput } from '~/components/form/SbInput';
import { ValidatedForm } from 'remix-validated-form';
import { checkoutAddressValidator, checkoutCustomerDataValidator } from '~/validators';


import { loader } from '~/route-containers/checkout/index.server';
export { loader };


export default function CheckoutShipping() {
  const { availableCountries, eligibleShippingMethods, activeCustomer, error } =
    useLoaderData<typeof loader>();
  const { activeOrderFetcher, activeOrder } = useOutletContext<OutletContext>();
  const [customerFormChanged, setCustomerFormChanged] = useState(false);
  const [addressFormChanged, setAddressFormChanged] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  let navigate = useNavigate();

  const { customer, shippingAddress } = activeOrder ?? {};
  const isSignedIn = !!activeCustomer?.id;
  const addresses = activeCustomer?.addresses ?? [];
  const defaultFullName =
    shippingAddress?.fullName ??
    (customer ? `${customer.firstName} ${customer.lastName}` : ``);
  const canProceedToPayment =
    customer &&
    ((shippingAddress?.streetLine1 && shippingAddress?.postalCode) ||
      selectedAddressIndex != null) &&
    activeOrder?.shippingLines?.length &&
    activeOrder?.lines?.length;

  const submitCustomerForm = async (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const isValid = (await checkoutCustomerDataValidator.validateField(formData, 'emailAddress')).error === undefined
                    && (await checkoutCustomerDataValidator.validateField(formData, 'firstName')).error === undefined
                    && (await checkoutCustomerDataValidator.validateField(formData, 'lastName')).error === undefined;
    if (customerFormChanged && isValid) {
      activeOrderFetcher.submit(formData, {
        method: 'POST',
        action: '/api/active-order',
      });
      setCustomerFormChanged(false);
    }
  };
  const submitAddressForm = async (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const isValid = (await checkoutAddressValidator.validateField(formData, 'fullName')).error === undefined
                    && (await checkoutAddressValidator.validateField(formData, 'streetLine')).error === undefined
                    && (await checkoutAddressValidator.validateField(formData, 'countryCode')).error === undefined
                    && (await checkoutAddressValidator.validateField(formData, 'phoneNumber')).error === undefined;
    if (addressFormChanged && isValid) {
      setShippingAddress(formData);
    }
  };
  const submitSelectedAddress = (index: number) => {
    const selectedAddress = activeCustomer?.addresses?.[index];
    if (selectedAddress) {
      setSelectedAddressIndex(index);
      const formData = new FormData();
      Object.keys(selectedAddress).forEach((key) =>
        formData.append(key, (selectedAddress as any)[key]),
      );
      formData.append('countryCode', selectedAddress.country.code);
      formData.append('action', 'setCheckoutShipping');
      setShippingAddress(formData);
    }
  };

  function setShippingAddress(formData: FormData) {
    if (shippingFormDataIsValid(formData)) {
      activeOrderFetcher.submit(formData, {
        method: 'POST',
        action: '/api/active-order',
      });
      setAddressFormChanged(false);
    }
  }

  const submitSelectedShippingMethod = (value?: string) => {
    if (value) {
      activeOrderFetcher.submit(
        {
          action: 'setShippingMethod',
          shippingMethodId: value,
        },
        {
          method: 'post',
          action: '/api/active-order',
        },
      );
    }
  };

  function navigateToPayment() {
    navigate('./payment');
  }

  return (
    <div>
      <div>
        <h2 className="text-lg font-medium text-gray-900">
          Захиалагчийн мэдээлэл
        </h2>

        {isSignedIn ? (
          <div>
            <p className="mt-2 text-gray-600">
              {customer?.firstName} {customer?.lastName}
            </p>
            <p>{customer?.emailAddress}</p>
          </div>
        ) : (
          <ValidatedForm
            method="POST"
            action="/api/active-order"
            validator={checkoutCustomerDataValidator}
            // fetcher={activeOrderFetcher}
            onBlur={submitCustomerForm}
            onChange={() => setCustomerFormChanged(true)}
            // hidden={isSignedIn}
          >
            <input type="hidden" name="action" value="setOrderCustomer" />
            <div className="mt-4">
              <SbInput
                name="emailAddress"
                autoComplete="emailAddress"
                label="Имэйл"
                type="text"
                required
                defaultValue={customer?.emailAddress}
              />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <SbInput
                  name="firstName"
                  label="Нэр"
                  defaultValue={customer?.firstName}
                  required
                  id="firstName"
                />
              </div>

              <div>
                <SbInput
                  name="lastName"
                  label="Овог"
                  defaultValue={customer?.lastName}
                  required
                  id="lastName"
                />
              </div>
            </div>
          </ValidatedForm>
        )}
      </div>

      <ValidatedForm
        method="POST"
        action="/api/active-order"
        // fetcher={activeOrderFetcher}
        validator={checkoutAddressValidator}
        onBlur={submitAddressForm}
        onChange={() => setAddressFormChanged(true)}
      >
        <input type="hidden" name="action" value="setCheckoutShipping" />
        <div className="mt-10 border-t border-gray-200 pt-10">
          <h2 className="text-lg font-medium text-gray-900">
            Хүргэлтийн хаяг
          </h2>
        </div>
        {isSignedIn && activeCustomer.addresses?.length ? (
          <div>
            <ShippingAddressSelector
              addresses={activeCustomer.addresses}
              selectedAddressIndex={selectedAddressIndex}
              onChange={submitSelectedAddress}
            />
          </div>
        ) : (
          <AddressForm
            availableCountries={activeOrder ? availableCountries : undefined}
            address={shippingAddress}
            defaultFullName={defaultFullName}
          />
        )}
      </ValidatedForm>

      <div className="mt-10 border-t border-gray-200 pt-10">
        <ShippingMethodSelector
          eligibleShippingMethods={eligibleShippingMethods}
          currencyCode={activeOrder?.currencyCode}
          shippingMethodId={activeOrder?.shippingLines[0]?.shippingMethod.id}
          onChange={submitSelectedShippingMethod}
        />
      </div>

      <button
        type="button"
        disabled={!canProceedToPayment}
        onClick={navigateToPayment}
        className={classNames(
          canProceedToPayment
            ? 'bg-indigo-600 hover:bg-indigo-700'
            : 'bg-gray-400',
          'flex w-full items-center justify-center space-x-2 mt-24 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
        )}
      >
        <LockClosedIcon className="w-5 h-5"></LockClosedIcon>
        <span>Үргэлжлүүлэх</span>
      </button>
    </div>
  );
}
