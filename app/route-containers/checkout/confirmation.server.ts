import { DataFunctionArgs } from '@remix-run/server-runtime';
import { getOrderByCode } from '~/providers/orders/order';

export async function loader({ params, request }: DataFunctionArgs) {
  try {
    const order = await getOrderByCode(params.orderCode!, { request });
    return {
      order,
      error: false,
    };
  } catch (ex) {
    return {
      order: null,
      error: true,
    };
  }
}
