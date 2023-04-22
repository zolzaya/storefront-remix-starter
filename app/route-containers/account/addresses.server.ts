import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { deleteCustomerAddress } from "~/providers/account/account";
import { getActiveCustomerAddresses } from "~/providers/customer/customer";
import { ErrorCode, ErrorResult } from '~/generated/graphql';


export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();
  const addressId = body.get('addressId') as string | null;

  if (addressId) {
    const result = await deleteCustomerAddress(addressId, { request });
    if (result.success) {
      return json(result);
    }
  }
  
  return json<ErrorResult>(
    {
      message: 'An unknown error occurred while removing your address.',
      errorCode: ErrorCode.UnknownError,
    },
    {
      status: 401,
    },
  );
}


export const loader = async ({ request }: LoaderArgs) => {
  const res = await getActiveCustomerAddresses({ request });
  const activeCustomerAddresses = res.activeCustomer;
  return json({ activeCustomerAddresses });
}
