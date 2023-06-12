import { CheckIcon, HeartIcon, PhotoIcon } from '@heroicons/react/24/solid';
import {
  FetcherWithComponents,
  ShouldRevalidateFunction,
  V2_MetaFunction,
  useLoaderData,
  useOutletContext
} from '@remix-run/react';
import { useState } from 'react';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { Price } from '~/components/products/Price';
import { APP_META_TITLE } from '~/constants';
import { CartLoaderData } from '~/routes/api/active-order';
// import { FetcherWithComponents } from '~/types';
import { SfButton } from '@storefront-ui/react';
import Alert from '~/components/Alert';
import { ScrollableContainer } from '~/components/products/ScrollableContainer';
import { StockLevelLabel } from '~/components/products/StockLevelLabel';
import { ErrorCode, ErrorResult } from '~/generated/graphql';


import { loader } from "~/route-containers/product.server";
import { SbSelect } from '~/components/form/SbSelect';
import { ValidatedForm } from 'remix-validated-form';
import { checkoutProductValidator } from '~/validators';
import ProductGallery from '~/components/products/ProductGallery';
export { loader };


export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [{
    title: data?.product?.name
      ? `${data.product.name} - ${APP_META_TITLE}`
      : APP_META_TITLE,
  }];
};


export const shouldRevalidate: ShouldRevalidateFunction = ({
  actionResult,
  currentParams,
  currentUrl,
  defaultShouldRevalidate,
  formAction,
  formData,
  formEncType,
  formMethod,
  nextParams,
  nextUrl,
}) => {
  return true;
};

export default function ProductSlug() {
  const { product, error } = useLoaderData<typeof loader>();
  const { activeOrderFetcher } = useOutletContext<{
    activeOrderFetcher: FetcherWithComponents<CartLoaderData>;
  }>();
  const { activeOrder } = activeOrderFetcher.data ?? {};
  const addItemToOrderError = getAddItemToOrderError(error);

  if (!product) {
    return <div>Product not found!</div>;
  }

  const findVariantById = (id: string) =>
    product.variants.find((v) => v.id === id);

  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0].id,
  );
  const selectedVariant = findVariantById(selectedVariantId);
  if (!selectedVariant) {
    setSelectedVariantId(product.variants[0].id);
  }

  const qtyInCart =
    activeOrder?.lines.find((l) => l.productVariant.id === selectedVariantId)
      ?.quantity ?? 0;

  const asset = product.assets[0];
  const brandName = product.facetValues.find(
    (fv) => fv.facet.code === 'brand',
  )?.name;

  const [featuredAsset, setFeaturedAsset] = useState(
    selectedVariant?.featuredAsset,
  );

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
          {product.name}
        </h2>
        <Breadcrumbs
          items={
            product.collections[product.collections.length - 1]?.breadcrumbs ?? []
          }
        ></Breadcrumbs>
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start mt-4 md:mt-12 mb-16">
          <div className="w-full max-w-2xl mx-auto sm:block lg:max-w-none">

            {/* Image gallery */}
            <ProductGallery assets={product.assets} />

            {/* <span className="rounded-md overflow-hidden">
              <div className="w-full h-full object-center object-cover rounded-lg">
                <img
                  src={
                    (featuredAsset?.preview || product.featuredAsset?.preview) +
                    '?w=800'
                  }
                  alt={product.name}
                  className="w-full h-full object-center object-cover rounded-lg"
                />
              </div>
            </span> */}

            {/* {product.assets.length > 1 && (
              <ScrollableContainer>
                {product.assets.map((asset) => (
                  <div
                    key={asset.id}
                    className={`basis-1/3 md:basis-1/4 flex-shrink-0 select-none touch-pan-x rounded-lg ${
                      featuredAsset?.id == asset.id
                        ? 'outline outline-2 outline-primary outline-offset-[-2px]'
                        : ''
                    }`}
                    onClick={() => {
                      setFeaturedAsset(asset);
                    }}
                  >
                    <img
                      draggable="false"
                      className="rounded-lg select-none h-24 w-full object-cover"
                      src={
                        asset.preview +
                        '?preset=full'
                      }
                    /</div>>
                  </div>
                ))}
              </ScrollableContainer>
            )} */}
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="">
              <h3 className="sr-only">Description</h3>

              <div
                className="text-base text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: product.description,
                }}
              />
            </div>
            <ValidatedForm noValidate={true} validator={checkoutProductValidator} fetcher={activeOrderFetcher} method="POST" action="/api/active-order">
              <input type="hidden" name="action" value="addItemToOrder" />
              {1 < product.variants.length ? (
                <div className="mt-4">
                  <SbSelect
                    id="productVariant"
                    value={selectedVariantId}
                    name="variantId"
                    placeholder=''
                    onChange={(e) => {
                      setSelectedVariantId(e.target.value);
                      const variant = findVariantById(e.target.value);
                      if (variant) {
                        setFeaturedAsset(variant!.featuredAsset);
                      }
                    }}
                  >
                    {product.variants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.name}
                      </option>
                    ))}
                  </SbSelect>
                </div>
              ) : (
                <input
                  type="hidden"
                  name="variantId"
                  value={selectedVariantId}
                ></input>
              )}

              <div className="mt-10 flex flex-col sm:flex-row sm:items-center">
                <p className="text-3xl text-gray-900 mr-4">
                  <Price
                    priceWithTax={selectedVariant?.priceWithTax}
                    currencyCode={selectedVariant?.currencyCode}
                  ></Price>
                </p>
                <div className="flex sm:flex-col1 align-baseline">
                  <button
                    type="submit"
                    className={`max-w-xs flex-1 ${
                      activeOrderFetcher.state !== 'idle'
                        ? 'bg-gray-400'
                        : qtyInCart === 0
                        ? 'bg-indigo-600 hover:bg-indigo-700'
                        : 'bg-green-600 active:bg-green-700 hover:bg-green-700'
                    }
                                     transition-colors border border-transparent rounded-md py-3 px-8 flex items-center
                                      justify-center text-base font-medium text-white focus:outline-none
                                      focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary-500 sm:w-full`}
                    disabled={activeOrderFetcher.state !== 'idle'}
                  >
                    {qtyInCart ? (
                      <span className="flex items-center">
                        <CheckIcon className="w-5 h-5 mr-1" /> {qtyInCart}{' '}
                        сагслагдав
                      </span>
                    ) : (
                      `Сагсанд нэмэх`
                    )}
                  </button>

                  {/* <SfButton type="button" className="ml-4 py-3 px-3" variant="tertiary" square aria-label="Add to favorites">
                    <HeartIcon
                      className="h-6 w-6 flex-shrink-0"
                      aria-hidden="true"
                    />
                  </SfButton> */}

                  {/* <button
                    type="button"
                    className="ml-4 py-3 px-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <HeartIcon
                      className="h-6 w-6 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Add to favorites</span>
                  </button> */}
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-gray-500">{selectedVariant?.sku}</span>
                <StockLevelLabel stockLevel={selectedVariant?.stockLevel} />
              </div>
              {addItemToOrderError && (
                <div className="mt-4">
                  <Alert message={addItemToOrderError} />
                </div>
              )}

              <section className="mt-6 pt-6 border-t text-xs">
                <h3 className="text-gray-600 font-bold mb-2">
                  Shipping & Returns
                </h3>
                <div className="text-gray-500 space-y-1">
                  <p>
                    Standard shipping: 3 - 5 working days. Express shipping: 1 -
                    3 working days.
                  </p>
                  <p>
                    Shipping costs depend on delivery address and will be
                    calculated during checkout.
                  </p>
                  <p>
                    Returns are subject to terms. Please see the{' '}
                    <span className="underline">returns page</span> for further
                    information.
                  </p>
                </div>
              </section>
            </ValidatedForm>
          </div>
        </div>
      </div>
      {/* <div className="mt-24">
        <TopReviews></TopReviews>
      </div> */}
    </div>
  );
}

export function CatchBoundary() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
        Product not found!
      </h2>
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start mt-4 md:mt-12">
        {/* Image gallery */}
        <div className="w-full max-w-2xl mx-auto sm:block lg:max-w-none">
          <span className="rounded-md overflow-hidden">
            <div className="w-full h-96 bg-slate-200 rounded-lg flex content-center justify-center">
              <PhotoIcon className="w-48 text-white"></PhotoIcon>
            </div>
          </span>
        </div>

        {/* Product info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <div className="">We couldn't find any product at that address!</div>
          <div className="flex-1 space-y-3 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getAddItemToOrderError(error?: ErrorResult): string | undefined {
  if (!error || !error.errorCode) {
    return undefined;
  }
  switch (error.errorCode) {
    case ErrorCode.OrderModificationError:
    case ErrorCode.OrderLimitError:
    case ErrorCode.NegativeQuantityError:
    case ErrorCode.InsufficientStockError:
      return error.message;
  }
}
