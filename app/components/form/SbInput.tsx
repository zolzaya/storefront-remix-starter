import { SfInput } from '@storefront-ui/react';
import React from 'react';
import { useField } from 'remix-validated-form';
import FormElement from '../FormElement';

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
      <FormElement name={name} label={label} helper={helper} required={required}>
        <SfInput 
          invalid={error !== undefined}
          ref={ref}
          // wrapperClassName={wrapperClassName}
          {...getInputProps()}
         />
      </FormElement>
   );
  },
);