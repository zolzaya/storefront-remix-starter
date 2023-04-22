import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { sdk } from "~/graphqlWrapper";
import { filteredSearchLoader } from "~/utils/filtered-search-loader";

export const loader = async ({ params, request, context }: LoaderArgs) => {
  const { result, resultWithoutFacetValueFilters, facetValueIds } =
  await filteredSearchLoader({
    params,
    request,
    context,
  });
  const collection = (await sdk.collection({ slug: params.slug })).collection;
  if (!collection?.id || !collection?.name) {
    throw new Response('Not Found', {
      status: 404,
    });
  }

  return json({
    collection,
    result,
    resultWithoutFacetValueFilters,
    facetValueIds,
  });
}