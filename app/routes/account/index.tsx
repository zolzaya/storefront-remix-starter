import { CheckIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import { DataFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import { withZod } from '@remix-validated-form/with-zod';
import { useEffect, useRef, useState } from 'react';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { z } from 'zod';
import { Button } from '~/components/Button';
import { ErrorMessage } from '~/components/ErrorMessage';
import { HighlightedButton } from '~/components/HighlightedButton';
import { Input } from '~/components/Input';
import Modal from '~/components/modal/Modal';
import {
  requestUpdateCustomerEmailAddress,
  updateCustomer,
} from '~/providers/account/account';
import { getActiveCustomerDetails } from '~/providers/customer/customer';
import useToggleState from '~/utils/use-toggle-state';
import { replaceEmptyString } from '~/utils/validation';

enum FormIntent {
  UpdateEmail = 'updateEmail',
  UpdateDetails = 'updateDetails',
}

export const profileValidator = withZod(
  z.object({
    title: z.string(),
    firstName: z.string().min(1, { message: 'Нэр хоосон байна' }),
    lastName: z.string().min(1, { message: 'Овог хоосон байна' }),
    phoneNumber: z.string().min(1, { message: 'Утасны дугаар хоосон байна' }),
  }),
);

const changeEmailValidator = withZod(
  z.object({
    email: z
      .string()
      .min(1, { message: 'Имэйл хаяг хоосон байна' })
      .email('Имэйл хаяг буруу байна'),
    password: z.string().min(1, { message: 'Нууц үг хоосон байна' }),
  }),
);

export async function loader({ request }: DataFunctionArgs) {
  const { activeCustomer } = await getActiveCustomerDetails({ request });
  if (!activeCustomer) {
    return redirect('/sign-in');
  }
  return json({ activeCustomer });
}

function isFormError(err: unknown): err is FormError {
  return (err as FormError).message !== undefined;
}

function isEmailSavedResponse(
  response: unknown,
): response is EmailSavedResponse {
  return (response as EmailSavedResponse).newEmailAddress !== undefined;
}

function isCustomerUpdatedResponse(
  response: unknown,
): response is CustomerUpdatedResponse {
  return (response as CustomerUpdatedResponse).customerUpdated !== undefined;
}

type FormError = {
  message: string;
  intent?: string;
};

type EmailSavedResponse = {
  newEmailAddress: string;
};

type CustomerUpdatedResponse = {
  customerUpdated: true;
};

export async function action({ request }: DataFunctionArgs) {
  const body = await request.formData();
  const intent = body.get('intent') as FormIntent | null;

  const formError = (formError: FormError, init?: number | ResponseInit) => {
    return json<FormError>(formError, init);
  };

  if (intent === FormIntent.UpdateEmail) {
    const result = await changeEmailValidator.validate(body);

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
    const result = await profileValidator.validate(body);

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

export default function AccountDetails() {
  const { activeCustomer } = useLoaderData<typeof loader>();
  const actionDataHook = useActionData<typeof action>();

  const { firstName, lastName, title, phoneNumber, emailAddress } =
    activeCustomer;
  const fullName = `${title ? title + ' ' : ''}${firstName} ${lastName}`;

  const { state } = useNavigation();
  const [formError, setFormError] = useState<FormError>();
  const [emailSavedResponse, setEmailSavedResponse] =
    useState<EmailSavedResponse>();
  const [showChangeEmailModal, openChangeEmailModal, closeChangeEmailModal] =
    useToggleState(false);
  const [isEditing, setIsEditing] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!actionDataHook) {
      return;
    }

    if (isEmailSavedResponse(actionDataHook)) {
      setEmailSavedResponse(actionDataHook);
      closeChangeEmailModal();
      return;
    }

    if (isCustomerUpdatedResponse(actionDataHook)) {
      setIsEditing(false);
      setFormError(undefined);
      return;
    }

    if (isFormError(actionDataHook)) {
      setFormError(actionDataHook);
      return;
    }
  }, [actionDataHook]);

  useEffect(() => {
    formRef.current?.reset();
  }, [isEditing]);

  return (
    <>
      <Modal
        isOpen={showChangeEmailModal}
        close={() => closeChangeEmailModal()}
        afterOpen={() => emailInputRef.current?.focus()}
        size="small"
      >
        <ValidatedForm validator={changeEmailValidator} method="post">
          <Modal.Title>Имэйл хаягаа солих</Modal.Title>
          <Modal.Body>
            <div className="space-y-4 my-8">

              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Анхааруулга</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Бид таны шинэ имэйл хаяг руу баталгаажуулах <strong>КОД</strong> илгээх болно.
                      </p><br />
                      <p>
                        Одоогийн имэйл: <strong>{emailAddress}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <input
                  type="hidden"
                  name="intent"
                  value={FormIntent.UpdateEmail}
                />
                <Input
                  ref={emailInputRef}
                  autoFocus
                  label="Шинэ имэйл хаяг"
                  name="email"
                  required
                />
                <Input
                  label="Нууц үг"
                  type="password"
                  name="password"
                  required
                />
                <input type="submit" hidden />
              </div>
              {formError && formError.intent === FormIntent.UpdateEmail && (
                <ErrorMessage
                  heading="We ran into a problem changing your E-Mail!"
                  message={formError.message}
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="reset" onClick={() => closeChangeEmailModal()}>
              Цуцлах
            </Button>
            <HighlightedButton
              type="submit"
              isSubmitting={state === 'submitting'}
            >
              Хадгалах
            </HighlightedButton>
          </Modal.Footer>
        </ValidatedForm>
      </Modal>

      <div className="space-y-10 p-4 mt-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <h3 className="text-sm text-gray-500">Имэйл</h3>
            {emailSavedResponse ? (
              <span>
                <span className="italic text-gray-800">
                  {emailSavedResponse.newEmailAddress}
                </span>
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                  имэйл хаяг баталгаажуулахыг хүлээж байна
                </span>
              </span>
            ) : (
              <span>{emailAddress}</span>
            )}
          </div>
          <div className="col-span-2">
            <HighlightedButton
              type="button"
              onClick={() => openChangeEmailModal()}
            >
              <PencilIcon className="w-4 h-4" /> Имэйл хаяг солих
            </HighlightedButton>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-10">
          <ValidatedForm
            validator={profileValidator}
            formRef={formRef}
            method="post"
            id="details"
            defaultValues={{
              title: title ?? undefined,
              firstName,
              lastName,
              phoneNumber: phoneNumber ?? undefined,
            }}
          >
            <input
              type="hidden"
              name="intent"
              value={FormIntent.UpdateDetails}
            />
            <div className="gap-4 grid sm:grid-cols-2">
              {isEditing && (
                <div className="col-span-2">
                  <Input label="Гарчиг" name="title" className="sm:w-1/4" />
                </div>
              )}
              {isEditing ? (
                <>
                  <div>
                    <Input label="Нэр" name="firstName" required />
                  </div>
                  <div>
                    <Input label="Овог" name="lastName" required />
                  </div>
                </>
              ) : (
                <div>
                  <h3 className="text-sm text-gray-500">Гарчиг</h3>
                  {replaceEmptyString(fullName)}
                </div>
              )}

              <div>
                {isEditing ? (
                  <Input label="Утасны дугаар" name="phoneNumber" required />
                ) : (
                  <div>
                    <h3 className="text-sm text-gray-500">Утасны дугаар</h3>
                    {replaceEmptyString(phoneNumber)}
                  </div>
                )}
              </div>
              <div className="col-span-2">
                {isEditing ? (
                  <>
                    {formError &&
                      formError.intent === FormIntent.UpdateDetails && (
                        <ErrorMessage
                          heading="Профайлыг хадгалахад алдаа гарлаа. Дахин оролдоно уу!"
                          message={formError.message}
                        />
                      )}

                    <div className="flex gap-x-4">
                      <HighlightedButton
                        type="submit"
                        isSubmitting={state === 'submitting'}
                      >
                        <CheckIcon className="w-4 h-4" /> Хадгалах
                      </HighlightedButton>

                      <Button type="reset" onClick={() => setIsEditing(false)}>
                        <XMarkIcon className="w-4 h-4" /> Цуцлах
                      </Button>
                    </div>
                  </>
                ) : (
                  <HighlightedButton
                    type="button"
                    onClick={() => setIsEditing(true)}
                  >
                    <PencilIcon className="w-4 h-4" /> Засах
                  </HighlightedButton>
                )}
              </div>
            </div>
          </ValidatedForm>
        </div>
      </div>
    </>
  );
}
