import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { SfButton } from '@storefront-ui/react';

type HighlightedButtonProps = React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>> & {
  isSubmitting?: boolean;
}

export function HighlightedButton(
  { isSubmitting = false, ...props }: HighlightedButtonProps,
) {
  return (
    <SfButton
      disabled={isSubmitting}
      {...props}
    >
      {props.children}
      {isSubmitting && <ArrowPathIcon className='w-4 h-4 animate-spin'></ArrowPathIcon>}
    </SfButton>
  );
}
