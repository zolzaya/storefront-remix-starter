import { useSubmit } from '@remix-run/react';
import { useRef, useState } from 'react';
import { ValidatedForm } from 'remix-validated-form';
import { HighlightedButton } from '../HighlightedButton';
import { Input } from '../Input';

import { validator } from '~/routes/subscribe';
import Reaptcha from 'reaptcha';
export { validator };
import { ClientOnly } from 'remix-utils';
import { useField } from 'remix-validated-form';

export function SubscriptionForm() {
  const { error, getInputProps } = useField('email', {
    formId: 'subscribe-form',
  });
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);
  let submit = useSubmit();

  const verify = () => {
    captchaRef.current.getResponse().then((res: any) => {
      setCaptchaToken(res);
    });
  };

  async function handleSubmit(event: any) {
    event.preventDefault(); // this will prevent Remix from submitting the form
    // await doSomethingAsync(); // do your async thing
    submit(event.currentTarget); // this will work as the normal Form submit but you trigger it
  }

  return (
    <div className="mt-8 xl:mt-0">
      <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
        superb.mn имэйлд бүртгүүлэх
      </h3>

      <p className="mt-4 text-base text-gray-500">
        Онцгой санал, хямдралын талаар хамгийн түрүүнд мэдээрэй.
      </p>

      <ValidatedForm
        className="grid grid-flow-row-dense grid-cols-3 grid-rows-2 gap-2 mt-2"
        validator={validator}
        method="POST"
        action="/subscribe"
        onSubmit={handleSubmit}
        id="subscribe-form"
      >
        <div className="col-span-2">
          <input
            type="text"
            autoComplete="email"
            className="appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white focus:border-white focus:placeholder-gray-400"
            placeholder="Имэйл хаягаа оруулна уу"
            {...getInputProps({ id: 'email-address' })}
          />
          {error && (
            <div className="pt-1 text-rose-500 text-sm">
              <span>{error}</span>
            </div>
          )}
        </div>
        <div>
          <HighlightedButton>Бүртгүүлэх</HighlightedButton>
        </div>
        <div className="col-span-3">
          <Reaptcha
            sitekey={'6LefL8wlAAAAAG9jqIDfxL_B10FOWNOp3TVx4Bh_'}
            ref={captchaRef}
            onVerify={verify}
          />
        </div>
      </ValidatedForm>
    </div>
  );
}
