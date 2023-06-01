import { useMatches } from '@remix-run/react';
import { RootLoaderData } from '~/root';

export function useRootLoader(): RootLoaderData {
  return useMatches().find((match) => match.id === 'root')!
    .data as RootLoaderData;
}
