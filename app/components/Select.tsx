import React, { SelectHTMLAttributes } from 'react';
import { useField } from 'remix-validated-form';
import FormElement from './FormElement';
import { SfSelect } from '@storefront-ui/react';

export type SelectProps = {
  placeholder?: string;
  label?: string;
  required?: boolean;
  defaultValue?: any;
  name: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    name,
    label,
    required,
    defaultValue,
    placeholder = '- Сонгох -',
    children,
    // ...props
  }, ref) => {
    const { error, getInputProps } = useField(name);

    return (
      <FormElement name={name} label={label} required={required}>
        <SfSelect
          // {...props}
          name={name}
          invalid={error !== undefined}
          defaultValue={defaultValue}
          // {...getInputProps({})}
          placeholder={placeholder}
        >
          {children}
        </SfSelect>
      </FormElement>
    );
  },
);
