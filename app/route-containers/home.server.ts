import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getCollections } from "~/providers/collections/collections";

export const loader = async ({ request }: LoaderArgs) => {
  const collections = await getCollections(request);
  return json({
    collections,
  });
}