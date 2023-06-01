import { V2_MetaFunction, useLoaderData } from '@remix-run/react';
import { useRef, useState } from 'react';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { FiltersButton } from '~/components/FiltersButton';
import { CollectionCard } from '~/components/collections/CollectionCard';
import FacetFilterControls from '~/components/facet-filter/FacetFilterControls';
import { FacetFilterTracker } from '~/components/facet-filter/facet-filter-tracker';
import { ProductCard } from '~/components/products/ProductCard';
import { APP_META_TITLE } from '~/constants';

import { loader } from "~/route-containers/collections.server";
export { loader };

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [{
    title: data?.collection
      ? `${data.collection?.name} - ${APP_META_TITLE}`
      : APP_META_TITLE,
  }];
};

export default function CollectionSlug() {
  const { collection, result, resultWithoutFacetValueFilters, facetValueIds } =
    useLoaderData<typeof loader>();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const facetValuesTracker = useRef(new FacetFilterTracker());
  facetValuesTracker.current.update(
    result,
    resultWithoutFacetValueFilters,
    facetValueIds,
  );
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
          {collection.name}
        </h2>

        <FiltersButton
          filterCount={facetValueIds.length}
          onClick={() => setMobileFiltersOpen(true)}
        />
      </div>

      {/* Breadcrumbs  */}
      <Breadcrumbs items={collection.breadcrumbs} />

      {collection.children?.length ? (
        <div className="max-w-2xl mx-auto py-16 sm:py-16 lg:max-w-none border-b mb-16">
          <h2 className="text-2xl font-light text-gray-900">Ангилал</h2>
          <div className="mt-6 grid max-w-xs sm:max-w-none mx-auto sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {collection.children.map((child) => (
              <CollectionCard
                key={child.id}
                collection={child}
              />
            ))}
          </div>
        </div>
      ) : (
        ''
      )}

      <div className="mt-6 grid sm:grid-cols-5 gap-x-4">
        <FacetFilterControls
          facetFilterTracker={facetValuesTracker.current}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
        />
        <div className="sm:col-span-5 lg:col-span-4">
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {result.items.map((item) => (
              <ProductCard key={item.productId} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CatchBoundary() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
        Collection not found!
      </h2>
      <div className="mt-6 grid sm:grid-cols-5 gap-x-4">
        <div className="space-y-6">
          <div className="h-2 bg-slate-200 rounded col-span-1"></div>
          <div className="h-2 bg-slate-200 rounded col-span-1"></div>
          <div className="h-2 bg-slate-200 rounded col-span-1"></div>
        </div>
        <div className="sm:col-span-5 lg:col-span-4">
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            <div className="h-64 bg-slate-200 rounded"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
