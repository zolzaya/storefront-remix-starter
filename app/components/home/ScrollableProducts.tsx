import { SfScrollable } from '@storefront-ui/react';
import ProductCard2 from '../products/ProductCard2';

export default function ScrollableProducts() {
  return (
    <SfScrollable className="items-center w-full mt-4 mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className="flex items-center justify-center text-gray-500 border border-dashed shrink-0 bg-neutral-100 border-negative-300"
        >
        <ProductCard2 />
        </div>
      ))}
    </SfScrollable>
  );
}