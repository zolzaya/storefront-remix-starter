import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { useLoaderData, useNavigation, useSubmit } from '@remix-run/react';
import { ValidatedForm } from 'remix-validated-form';
import { Button } from '~/components/Button';
import { SbSelect } from '~/components/form/SbSelect';
import OrderHistoryItem from '~/components/account/OrderHistoryItem';
import { ALLOWED_PAGINATION_LIMITS } from '~/constants';

import { loader, orderPaginationValidator } from "~/route-containers/account/orders.server";
export { loader, orderPaginationValidator };


export default function AccountHistory() {
  const { orderList, appliedPaginationLimit, appliedPaginationPage } =
    useLoaderData<typeof loader>();
  const submit = useSubmit();
  const navigation = useNavigation();
  const showingOrdersFrom =
    (appliedPaginationPage - 1) * appliedPaginationLimit + 1;
  const showingOrdersTo = showingOrdersFrom + orderList.items.length - 1;

  return (
    <div className="pt-10 relative">
      {/* Loading-Overlay */}
      {navigation.state !== 'idle' && (
        <div className="absolute top-0 left-0 w-full h-full z-100 bg-white bg-opacity-75"></div>
      )}

      {orderList.items.length === 0 && (
        <div className="py-16 text-3xl text-center italic text-gray-300 select-none flex justify-center items-center">
          {orderList.totalItems === 0
            ? 'Захиалга бүртгэгдээгүй байна.'
            : 'Захиалгуудын төгсгөлд ирлээ.'}
        </div>
      )}
      {/* The actual orders */}
      {orderList.items?.map((item) => (
        // TODO: CHECK THIS ERROR OUT
        <OrderHistoryItem
          key={item.code}
          order={item}
          isInitiallyExpanded={false}
          className="mb-10"
        />
      ))}

      {/* Pagination */}
      <div className="flex flex-row justify-between items-center gap-4">
        <span className="self-start text-gray-500 text-sm xs:ml-4 mt-2">
          Нийт {orderList.totalItems} захиалгын {showingOrdersFrom} - {showingOrdersTo} харуулж байна
        </span>
        <ValidatedForm
          className="flex flex-col md:flex-row justify-center items-end md:items-center gap-4 lg:gap-6"
          validator={orderPaginationValidator}
          method="get"
          onChange={(e) =>
            submit(e.currentTarget, { preventScrollReset: true })
          }
          preventScrollReset
        >
          <span className="flex gap-4 items-center">
            {navigation.state !== 'idle' && (
              <ArrowPathIcon className="animate-spin h-6 w-6 text-gray-500" />
            )}
            <SbSelect
              name="limit"
              required
              defaultValue={appliedPaginationLimit}
            >
              {Array.from(ALLOWED_PAGINATION_LIMITS).map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </SbSelect>
          </span>

          <div className="flex" role="group">
            <Button
              name="page"
              type="submit"
              value={appliedPaginationPage - 1}
              disabled={
                appliedPaginationPage <= 1 || navigation.state !== 'idle'
              }
              className="!text-sm rounded-r-none border-r-0"
            >
              Өмнөх
            </Button>
            <Button
              name="page"
              type="submit"
              value={appliedPaginationPage + 1}
              disabled={
                appliedPaginationPage * appliedPaginationLimit >=
                  orderList.totalItems || navigation.state !== 'idle'
              }
              className="!text-sm rounded-l-none"
            >
              Дараах
            </Button>
          </div>
        </ValidatedForm>
      </div>
    </div>
  );
}
