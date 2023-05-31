import { SfInput } from '@storefront-ui/react';
import React from 'react';
import { useField } from 'remix-validated-form';

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'placeholder'
> & {
  label?: string;
  helper?: string;
  wrapperClassName?: string;
  name: string;
  required?: boolean;
};

export const SbInput = React.forwardRef<HTMLInputElement, InputProps>(
({ name, helper, label, wrapperClassName, required=false, ...props }, ref) => {
    const { error, getInputProps } = useField(name);

    return (
    <>
      <label htmlFor={name}>
        <span className="text-sm font-medium">
          {label}
        </span>
          {required && <span className="text-rose-500">*</span>}
        <SfInput 
          invalid={error === undefined}
          ref={ref}
          wrapperClassName={wrapperClassName}
          {...getInputProps()}
         />
      </label>
      <div className="flex justify-between">
        <div>
          {error && (
            <p className="text-sm text-negative-700 font-medium mt-0.5">{error}</p>
          )}

          {helper && (
            <p className="text-xs text-neutral-500 mt-0.5">Help Text</p>
          )}
        </div>
      </div>
    </>
   );
  },
);