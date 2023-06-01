import { PencilIcon } from '@heroicons/react/24/outline';
import { useActionData, useNavigation } from '@remix-run/react';
import { SfButton } from '@storefront-ui/react';
import { useEffect, useRef, useState } from 'react';
import { ValidatedForm } from 'remix-validated-form';
import { ErrorMessage } from '~/components/ErrorMessage';
import { HighlightedButton } from '~/components/HighlightedButton';
import { Input } from '~/components/Input';
import { SuccessMessage } from '~/components/SuccessMessage';
import {
  isErrorResult,
  isValidationErrorResponseData,
} from '~/utils/validation-helper';


import { action } from "~/route-containers/account/password.server";
export { action };

import { customerChangePasswordValidator } from '~/validators';

export default function AccountPassword() {
  const [editing, setEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const actionDataHook = useActionData<typeof action>();
  const { state } = useNavigation();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isValidationErrorResponseData(actionDataHook)) {
      // no additional handling
      return;
    }

    if (isErrorResult(actionDataHook)) {
      // set error message
      setErrorMessage(actionDataHook.message);
      setIsSaved(false);
      return;
    }

    if (actionDataHook?.success) {
      // show success message and reset form
      setErrorMessage(undefined);
      setIsSaved(true);
      setEditing(false);
      formRef.current?.reset();
    }
  }, [actionDataHook]);

  return (
    <ValidatedForm validator={customerChangePasswordValidator} method="post" formRef={formRef}>
      <div className="p-4 space-y-4">
        {editing && (
          <>
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              <div>
                <Input
                  required
                  label="Одоогийн нууц үг"
                  name="currentPassword"
                  type="password"
                />
              </div>
            </div>
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              <div>
                <Input
                  required
                  label="Шинэ нууц үг"
                  name="newPassword"
                  type="password"
                />
              </div>
              <div>
                <Input
                  required
                  label="Баталгаажуулах нууц үг"
                  name="confirmPassword"
                  type="password"
                />
              </div>
            </div>
          </>
        )}
        {isSaved && (
          <SuccessMessage
            heading="Амжилттай!"
            message="Таны нууц үг шинэчлэгдлээ."
          />
        )}
        {errorMessage && (
          <ErrorMessage
            heading="Алдаа! Нууц үг шинэчлэхэд алдаа гарлаа."
            message="Одоогийн нууц үг тохирохгүй байна!"
          />
        )}
        {editing ? (
          <div className="flex gap-3">
            <HighlightedButton type="submit" isSubmitting={state === 'submitting'}>
              Нууц үгээ солих
            </HighlightedButton>
            <SfButton variant="tertiary" type="reset" onClick={() => setEditing(false)}>
              Цуцлах
            </SfButton>
          </div>
        ) : (
          <>
            <HighlightedButton type="button" onClick={() => setEditing(true)}>
              <PencilIcon className="w-4 h-4" /> Нууц үгээ солих
            </HighlightedButton>
          </>
        )}
      </div>
    </ValidatedForm>
  );
}
