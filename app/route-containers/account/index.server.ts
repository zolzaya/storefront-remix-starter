import { DataFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import { validationError } from 'remix-validated-form';
import { FormError, FormIntent } from '~/forms';
import {
    requestUpdateCustomerEmailAddress,
    updateCustomer,
} from '~/providers/account/account';
import { getActiveCustomerDetails } from '~/providers/customer/customer';
import { customerChangeEmailValidator, customerProfileValidator } from '~/validators';

type EmailSavedResponse = {
  newEmailAddress: string;
};


export async function action({ request }: DataFunctionArgs) {
  const body = await request.formData();
  const intent = body.get('intent') as FormIntent | null;

  const formError = (formError: FormError, init?: number | ResponseInit) => {
    return json<FormError>(formError, init);
  };

  if (intent === FormIntent.UpdateEmail) {
    const result = await customerChangeEmailValidator.validate(body);

    if (result.error) {
      return validationError(result.error);
    }

    const { email, password } = result.data;

    const updateResult = await requestUpdateCustomerEmailAddress(
      password,
      email,
      { request },
    );

    if (updateResult.__typename !== 'Success') {
      return formError(
        { message: updateResult.message, intent: FormIntent.UpdateEmail },
        {
          status: 401,
        },
      );
    }

    return json<EmailSavedResponse>(
      {
        newEmailAddress: email,
      },
      { status: 200 },
    );
  }

  if (intent === FormIntent.UpdateDetails) {
    const result = await customerProfileValidator.validate(body);

    if (result.error) {
      return validationError(result.error);
    }

    const { title, firstName, lastName, phoneNumber } = result.data;
    await updateCustomer(
      { title, firstName, lastName, phoneNumber },
      { request },
    );

    return json({
      customerUpdated: true,
    });
  }

  return formError({ message: 'No valid form intent' }, { status: 401 });
}


export async function loader({ request }: DataFunctionArgs) {
  const { activeCustomer } = await getActiveCustomerDetails({ request });
  if (!activeCustomer) {
    return redirect('/sign-in');
  }
  return json({ activeCustomer });
}

