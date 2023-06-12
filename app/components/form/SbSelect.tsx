import React, { SelectHTMLAttributes } from 'react';
import { useField } from 'remix-validated-form';
import FormElement from '../FormElement';
import { SfSelect } from '@storefront-ui/react';

export type SelectProps = {
  placeholder?: string;
  label?: string;
  helper?: string;
  required?: boolean;
  defaultValue?: any;
  name: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const SbSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    name,
    label,
    helper,
    required,
    defaultValue,
    placeholder = '- Сонгох -',
    children,
    // ...props
  }, ref) => {
    const { error, getInputProps } = useField(name);

    return (
      <FormElement name={name} label={label} helper={helper} required={required}>
        <SfSelect
          // {...props}
          name={name}
          invalid={error !== undefined}
          // defaultValue={defaultValue}
          value={defaultValue}
          // {...getInputProps({})}
          placeholder={placeholder}
        >
          {children}
        </SfSelect>
      </FormElement>
    );
  },
);
