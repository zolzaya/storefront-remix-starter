import { ArrowPathIcon, CreditCardIcon, PencilIcon, TrashIcon, TruckIcon } from '@heroicons/react/24/outline';
import { Link, useFetcher } from '@remix-run/react';
import clsx from 'clsx';
import { useState } from 'react';
import { Address, ErrorResult } from '~/generated/graphql';
import { ErrorMessage } from '../ErrorMessage';
import { SfButton } from '@storefront-ui/react';
import { HighlightedButton } from '../HighlightedButton';
import Modal from '../modal/Modal';

type EditAddressProps = {
  address: Address;
  isActive?: boolean;
};

export default function EditAddressCard({
  address,
  isActive = false,
}: EditAddressProps) {

  const setShipping = useFetcher();
  const setBilling = useFetcher();
  const deleteAddress = useFetcher<ErrorResult>();
  const [isDeleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  return (
    <>
      {/* Note: Only allow closing when it isnt loading to prevent accidental closing via outside-click */}
      <Modal isOpen={isDeleteModalVisible} close={() => setDeleteModalVisible(deleteAddress.state === 'idle' ? false : true)}>
        <deleteAddress.Form method="post" preventScrollReset>
          <Modal.Title>Хаяг устгах</Modal.Title>
          <Modal.Body>
            <div className="space-y-4 my-4">
              Та энэ хаягийг устгахыг хүсч байна уу?
              <input type="hidden" name="id" value={address.id} />
              {deleteAddress.data && (
                <ErrorMessage
                  heading='Хаягийг устгаж чадсангүй!'
                  message={deleteAddress.data?.message ?? 'Алдаа гарлаа!'}
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <SfButton type="button"
              variant="tertiary"
              onClick={() => setDeleteModalVisible(false)}
              disabled={deleteAddress.state !== 'idle'}
            >
              Цуцлах
            </SfButton>
            <HighlightedButton
              type="submit"
              name='_action'
              value='deleteAddress'
              disabled={deleteAddress.state !== 'idle'}
              isSubmitting={deleteAddress.state !== 'idle'}
            >
              Тийм
            </HighlightedButton>
          </Modal.Footer>
        </deleteAddress.Form>
      </Modal>
      <div
        className={clsx(
          'border border-gray-200 p-5 min-h-[220px] h-full w-full flex flex-col justify-between gap-8 transition-colors',
          {
            'border-gray-900': isActive,
          },
        )}
      >
        <div className="flex justify-between">
          {/* Customer Data Section */}
          <div className="flex flex-col">
            <span className="text-left text-base-semi">{address.fullName}</span>
            {address.company && (
              <span className="text-small-regular text-gray-700">
                {address.company}
              </span>
            )}
            <div className="flex flex-col text-left text-base-regular mt-2">
              <span>
                {address.streetLine1},
                {/* {address.streetLine2 && <span>, {address.streetLine2}</span>} */}
              </span>
              {/* <span>
                {address.postalCode}, {address.city}
              </span> */}
              <span>
                {/* {address.province && `${address.province}, `} */}
                {address.country?.code?.toUpperCase()}
              </span>
            </div>
          </div>
          {/* Default Shipping/Billing Section */}
          {(address.defaultShippingAddress || address.defaultBillingAddress) && (
            <div className='text-end text-gray-500 uppercase tracking-wider'>
              <span className="block text-sm font-medium">Үндсэн</span>
              <span className="block text-xs mt-1">
                {address.defaultShippingAddress && "хүргэлтийн хаяг"}
                {address.defaultShippingAddress && address.defaultBillingAddress && <><br />&amp;&nbsp;</>}
                {address.defaultBillingAddress && "төлбөрийн хаяг"}</span>
            </div>
          )}
        </div>
        {/* CRUD Actions */}
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className='flex items-center gap-4'>
            <Link
              role="button"
              preventScrollReset
              className="text-gray-700 flex items-center gap-x-2"
              to={`/account/addresses/${address.id}`}
            >
              <PencilIcon className="w-4 h-4"></PencilIcon>
              засах
            </Link>
            <button type="button"
              title="Delete this address"
              className="text-gray-700 flex items-center gap-x-2"
              disabled={deleteAddress.state !== "idle"}
              onClick={() => setDeleteModalVisible(true)}
            >
              {deleteAddress.state === "idle" ?
                <TrashIcon className="w-4 h-4"></TrashIcon>
                :
                <ArrowPathIcon className='w-4 h-4 animate-spin'></ArrowPathIcon>
              }
              устгах
            </button>
          </div>
          {(!address.defaultShippingAddress || !address.defaultBillingAddress) && (
            <div>
              <span className='text-gray-500 flex gap-4'>
                {/* Default shipping */}
                {!address.defaultShippingAddress && (
                  <setShipping.Form method='post'>
                    <input type="hidden" name="id" value={address.id} />
                    <button name="_action" value="setDefaultShipping" type="submit"
                      title="Set as default shipping address"
                      className='text-gray-700 flex items-center gap-2'
                      disabled={setShipping.state !== "idle"}
                    >
                      {setShipping.state === "idle" ?
                        <TruckIcon className="w-4 h-4"></TruckIcon>
                        :
                        <ArrowPathIcon className='w-4 h-4 animate-spin'></ArrowPathIcon>
                      }
                      хүргэлт
                    </button>
                  </setShipping.Form>
                )}

                {!address.defaultBillingAddress && (
                  <setBilling.Form method='post'>
                    <input type="hidden" name="id" value={address.id} />
                    <button name="_action" value="setDefaultBilling" type="submit"
                      title="Set as default billing address"
                      className='text-gray-700 flex items-center gap-2'
                      disabled={setBilling.state !== "idle"}
                    >
                      {setBilling.state === "idle" ?
                        <CreditCardIcon className="w-4 h-4"></CreditCardIcon>
                        :
                        <ArrowPathIcon className='w-4 h-4 animate-spin'></ArrowPathIcon>
                      }
                      төлбөр
                    </button>
                  </setBilling.Form>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
