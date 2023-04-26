import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';
import { RefObject } from 'react';
import { ValidatedForm } from 'remix-validated-form';
import { Address, AvailableCountriesQuery } from '~/generated/graphql';
import { Input } from '~/components/Input';
import { Select } from '~/components/Select';

export const validator = withZod(
  z.object({
    fullName: z.string().min(1, { message: 'Нэр хоосон байна' }),
    city: z.string().optional(),
    countryCode: z.string().min(1, { message: 'Хот / Аймаг хоосон байна' }),
    postalCode: z.string().optional(),
    province: z.string().optional(),
    streetLine1: z.string().min(1, { message: 'Хаяг хоосон байна' }),
    streetLine2: z.string().optional(),
    phone: z.string().min(1, { message: "Утасны дугаар хоосон байна" }),
    company: z.string().optional(),
  }),
);

export default function CustomerAddressForm({
  address,
  formRef,
  submit,
  availableCountries,
}: {
  address?: Address;
  formRef: RefObject<HTMLFormElement>;
  submit: () => void;
  availableCountries: AvailableCountriesQuery['availableCountries'];
}) {
  return (
    <ValidatedForm
      id="editAddressForm"
      validator={validator}
      formRef={formRef}
      method="post"
      onSubmit={submit}
      defaultValues={{
        fullName: address?.fullName || undefined,
        city: address?.city || undefined,
        streetLine1: address?.streetLine1 || undefined,
        streetLine2: address?.streetLine2 || undefined,
        countryCode: address?.country?.code || undefined,
        postalCode: address?.postalCode || undefined,
        phone: address?.phoneNumber || undefined,
        company: address?.company || undefined,
        province: address?.province || undefined,
      }}
    >
      <input type="hidden" name="intent" value="updateAddress" />
      <div className="grid grid-cols-1 gap-y-2 my-8">
        <Input
          label="Нэр"
          name="fullName"
          required
          autoComplete="full-name"
        />
        <Input label="Компани" name="company" />
        <Input label="Утасны дугаар" name="phone" autoComplete="phone" required />
        <Input
          label="Хаяг"
          name="streetLine1"
          required
          autoComplete="address-line1"
        />
        {/* <Input
          label="Apartment, suite, etc."
          name="streetLine2"
          autoComplete="address-line2"
        /> */}
        {/* <input type="hidden" name="postalcode" value="210200" />
        <input type="hidden" name="city" value="ub" /> */}
        {/* <div className="grid grid-cols-[144px_1fr] gap-x-2">
          <Input
            label="Postal code"
            name="postalCode"
            required
            autoComplete="postal-code"
          />
          <Input label="City" name="city" required autoComplete="locality" />
        </div> */}
        {/* <Input
          label="Province / State"
          name="province"
          autoComplete="address-level1"
        /> */}
        <Select
          name="countryCode"
          autoComplete="country"
          placeholder="-- Сонгох --"
          required
          label="Хот / Аймаг"
        >
          {availableCountries?.map((country) => (
            <option key={country.id} value={country.code} selected={country.code === "ulaanbaatar"}>
              {country.name}
            </option>
          ))}
        </Select>
        <input type="submit" hidden />
      </div>
    </ValidatedForm>
  );
}
