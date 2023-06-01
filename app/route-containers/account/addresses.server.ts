import { DataFunctionArgs, json } from '@remix-run/server-runtime';
import { ErrorCode, ErrorResult } from '~/generated/graphql';
import { deleteCustomerAddress, updateCustomerAddress } from '~/providers/account/account';
import { getActiveCustomerAddresses } from '~/providers/customer/customer';

export async function loader({ request }: DataFunctionArgs) {
  const res = await getActiveCustomerAddresses({ request });
  const activeCustomerAddresses = res.activeCustomer;
  return json({ activeCustomerAddresses });
}

export async function action({ request }: DataFunctionArgs) {
  const formData = await request.formData();
  const id = formData.get('id') as string | null;
  const _action = formData.get('_action');

  // Verify that id is set
  if (!id || id.length === 0) {
    return json<ErrorResult>(
      {
        errorCode: ErrorCode.IdentifierChangeTokenInvalidError, // TODO: I dont think this error is 100% appropriate - decide later
        message: "Parameter 'id' is missing"
      },
      {
        status: 400, // Bad request
      },
    );
  }

  if (_action === "setDefaultShipping") {
    updateCustomerAddress({ id, defaultShippingAddress: true }, { request });
    return null;
  }

  if (_action === "setDefaultBilling") {
    updateCustomerAddress({ id, defaultBillingAddress: true }, { request });
    return null;
  }

  if (_action === "deleteAddress") {
    const { success } = await deleteCustomerAddress(id, { request });
    return json(null, { status: success ? 200 : 400 });
  }

  return json<ErrorResult>(
    {
      message: 'An unknown error occurred',
      errorCode: ErrorCode.UnknownError,
    },
    {
      status: 400,
    },
  );
}