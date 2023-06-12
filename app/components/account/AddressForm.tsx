import { AvailableCountriesQuery, OrderAddress } from '~/generated/graphql';
import { SbInput } from '../form/SbInput';
import { SbSelect } from '../form/SbSelect';

export function AddressForm({
  address,
  defaultFullName,
  availableCountries,
}: {
  address?: OrderAddress | null;
  defaultFullName?: string;
  availableCountries?: AvailableCountriesQuery['availableCountries'];
}) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
      <div>
        <SbInput
          id="fullName"
          name="fullName"
          label="Нэр"
          required
          defaultValue={defaultFullName}
          autoComplete="given-name"
        />
      </div>

      <div className="sm:col-span-2">
        <SbInput
          name="company"
          id="company"
          label="Компани"
          defaultValue={address?.company ?? ''}
        />
      </div>

      <div className="sm:col-span-2">
        <SbInput
          name="streetLine1"
          id="streetLine1"
          label="Хаяг"
          helper="Helper text going to here"
          required
          defaultValue={address?.streetLine1 ?? ''}
        />
      </div>

      <div>
        <SbSelect
          name="countryCode"
          id="countryCode"
          label="Хот / Аймаг"
          placeholder="-- Сонгох --"
          required
        >
          {availableCountries?.map((country) => (
            <option key={country.id} value={country.code}>
              {country.name}
            </option>
          ))}
        </SbSelect>
      </div>

      <div>
        <SbInput
          name="phoneNumber"
          id="phoneNumber"
          label="Утасны дугаар"
          required
          defaultValue={address?.phoneNumber ?? ''}
          className='mt-2'
        />
      </div>
    </div>
  );
}
