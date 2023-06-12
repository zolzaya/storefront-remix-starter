import { ProductCardProps } from './ProductCard';

export function Price({
  priceWithTax,
  currencyCode,
}: {
  priceWithTax?: number | ProductCardProps['priceWithTax'];
  currencyCode?: ProductCardProps['currencyCode'];
}) {
  if (priceWithTax == null || !currencyCode) {
    return <></>;
  }
  if (typeof priceWithTax === 'number') {
    return <>{formatPrice(priceWithTax)}</>;
  }
  if ('value' in priceWithTax) {
    return <>{formatPrice(priceWithTax.value)}</>;
  }
  if (priceWithTax.min === priceWithTax.max) {
    return <>{formatPrice(priceWithTax.min)}</>;
  }
  return (
    <>
      {formatPrice(priceWithTax.min)} -{' '}
      {formatPrice(priceWithTax.max)}
    </>
  );
}

export function formatPrice(amount: number) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ₮";
  // return new Intl.NumberFormat('en-US', {
  //   currency: "MNT",
  //   style: "currency",
  //   minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //   maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  // }).format(amount) + ' ₮';
}
