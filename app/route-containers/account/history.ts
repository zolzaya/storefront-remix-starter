import { DataFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';
import { OrderListOptions, SortOrder } from '~/generated/graphql';
import { getActiveCustomerOrderList } from '~/providers/customer/customer';

const paginationLimitMinimumDefault = 10;
const allowedPaginationLimits = new Set<number>([
  paginationLimitMinimumDefault,
  20,
  30,
]);
const paginationLimitDerivedMax = Math.max(
  ...Array.from(allowedPaginationLimits),
);

const orderPaginationLimitSchema = z
  .number({
    required_error: 'Limit is required',
    invalid_type_error: 'Limit must be a number',
    coerce: true,
  })
  .int()
  .min(paginationLimitMinimumDefault, {
    message: `Limit must be at least ${paginationLimitMinimumDefault}`,
  })
  .max(paginationLimitDerivedMax, {
    message: `Maximum limit is ${paginationLimitDerivedMax}`,
  })
  .refine((x) => allowedPaginationLimits.has(x));

const orderPaginationPageSchema = z
  .number({
    required_error: 'Page is required',
    invalid_type_error: 'Page must be a number',
    coerce: true,
  })
  .int()
  .min(1, { message: 'Page must be at least 1' })
  .max(1000, { message: "Page can't be over 1000" });

const orderPaginationSchema = z.object({
  limit: orderPaginationLimitSchema,
  page: orderPaginationPageSchema,
});

export const orderPaginationValidator = withZod(orderPaginationSchema);

export async function loader({ request }: DataFunctionArgs) {
  const url = new URL(request.url);
  // Careful params are user controllable data - never blindly trust it!
  // Use the .default fallbacks in case that params are undefined i.e. `null`
  const limit = url.searchParams.get('limit') ?? paginationLimitMinimumDefault;
  const page = url.searchParams.get('page') ?? 1;

  // Validate, if we fail we redirect to default params
  // We could provide error information but under normal usage this shouldnt happen because
  // we also validate on client side, which means we should only land here if the user
  // opens a manually modified or no longer supported url
  const zodResult = orderPaginationSchema.safeParse({ limit, page });
  if (!zodResult.success) {
    url.search = '';
    return redirect(url.href);
  }

  // From here on data is safe - Construct the options for vendure
  const orderListOptions: OrderListOptions = {
    take: zodResult.data.limit,
    skip: (zodResult.data.page - 1) * zodResult.data.limit, // Page is one-base-indexed so we gotta decrement first
    sort: { createdAt: SortOrder.Desc },
    filter: { active: { eq: false } },
  };

  const res = await getActiveCustomerOrderList(orderListOptions, { request });
  if (!res.activeCustomer) {
    return redirect('/sign-in');
  }
  return json({
    orderList: res.activeCustomer.orders,
    appliedPaginationLimit: zodResult.data.limit,
    appliedPaginationPage: zodResult.data.page,
  });
}