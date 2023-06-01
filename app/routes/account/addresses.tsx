import { Outlet, useLoaderData } from '@remix-run/react';
import AddAddressCard from '~/components/account/AddAddressCard';
import EditAddressCard from '~/components/account/EditAddressCard';
import { Address } from '~/generated/graphql';

import { loader, action } from '~/route-containers/account/addresses.server';
export { loader, action };

export default function AccountAddresses() {
  const { activeCustomerAddresses } = useLoaderData<typeof loader>();

  return (
    <>
      <Outlet></Outlet>
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 mt-4">
          <AddAddressCard />
          {activeCustomerAddresses?.addresses!.map((address) => {
            return (
              <EditAddressCard
                address={address as Address}
                key={address.id}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
