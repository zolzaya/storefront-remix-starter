import { useLoaderData } from '@remix-run/react';
import Banners from '~/components/home/Banners';
import { Hero } from '~/components/home/Hero';
import NewsletterBox from '~/components/home/NewsletterBox';
import ScrollableProducts from '~/components/home/ScrollableProducts';
import ProductCardHorizontal from '~/components/products/ProductCardHorizontal';
import { loader } from "~/route-containers/home.server";
export { loader };

export default function Index() {
  const { collections } = useLoaderData<typeof loader>();
  return (
    <>

      <main>
        <div className="relative">
          <Hero />
        </div>

        <section aria-labelledby="scrollable-products" className="my-5 sm:pt-32 xl:max-w-7xl xl:mx-auto xl:px-8">
          <ScrollableProducts />
        </section>

        <section aria-labelledby="banners" className="my-10 sm:pt-32 xl:max-w-7xl xl:mx-auto xl:px-8">
          <Banners />
        </section>

        <section aria-labelledby="today-deals" className="grid grid-cols-2 gap-4 my-10 xl:max-w-7xl xl:mx-auto xl:px-8">
          <ProductCardHorizontal />
          <ProductCardHorizontal />
        </section>

        <NewsletterBox />
      </main>

    </>
  );
}
