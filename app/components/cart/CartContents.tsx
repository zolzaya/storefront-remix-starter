import { Form, Link } from '@remix-run/react';
import { Price } from '~/components/products/Price';
import { ActiveOrderQuery, CurrencyCode } from '~/generated/graphql';
import QuantitySelector from '../products/QuantitySelector';

export function CartContents({
  orderLines,
  currencyCode,
  editable = true,
  adjustOrderLine,
  removeItem,
}: {
  orderLines: NonNullable<ActiveOrderQuery['activeOrder']>['lines'];
  currencyCode: CurrencyCode;
  editable: boolean;
  adjustOrderLine?: (lineId: string, quantity: number) => void;
  removeItem?: (lineId: string) => void;
}) {
  const isEditable = editable !== false;
  return (
    <div className="flow-root">
      <ul role="list" className="-my-6 divide-y divide-gray-200">
        {(orderLines ?? []).map((line) => (
          <li key={line.id} className="py-6 flex">
            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
              <img
                src={line.featuredAsset?.preview + '?preset=thumb'}
                alt={line.productVariant.name}
                className="w-full h-full object-center object-cover"
              />
            </div>

            <div className="ml-4 flex-1 flex flex-col">
              <div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <h3>
                    <Link to={`/p/${line.productVariant.product.slug}`}>
                      {line.productVariant.name}
                    </Link>
                  </h3>
                  <p className="ml-4">
                    <Price
                      priceWithTax={line.linePriceWithTax}
                      currencyCode={currencyCode}
                    ></Price>
                  </p>
                </div>
              </div>
              <div className="flex-1 flex items-center text-sm">
                {editable ? (
                  <Form>
                    <label htmlFor={`quantity-${line.id}`} className="mr-2">
                      Тоо ширхэг
                    </label>
                    <QuantitySelector lineId={line.id} cssClasses="mt-2" max={10} quantity={line.quantity || 1} disabled={false} adjustOrderLine={adjustOrderLine} />
                  </Form>
                ) : (
                  <div className="text-gray-800">
                    <span className="mr-1">тоо ширхэг:</span>
                    <span className="font-medium">{line.quantity}</span>
                  </div>
                )}
                <div className="flex-1"></div>
                <div className="flex">
                  {isEditable && (
                    <button
                      type="submit"
                      name="removeItem"
                      value={line.id}
                      className="font-medium text-red-600 hover:text-red-500"
                      onClick={() => removeItem && removeItem(line.id)}
                    >
                      Хасах
                    </button>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
