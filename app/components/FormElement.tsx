import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import { useField } from 'remix-validated-form';

type FormElementProps = {
  name: string;
  label?: string;
  helper?: string;
  required?: boolean;
};

const FormElement: React.FC<PropsWithChildren<FormElementProps>> = ({
  children,
  label,
  helper,
  name,
  required = false,
}) => {
  const { error } = useField(name);

  return (
    <div>
      {label && (
        <label htmlFor={name} className={clsx('text-sm')}>
          {label}
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className={label && "mt-1"}>{children}</div>
      {error && (
        <div className="pt-1 text-rose-500 text-sm">
          <span>{error}</span>
        </div>
      )}


      {helper && (
        <p className="text-xs text-neutral-500 mt-0.5">{helper}</p>
      )}
    </div>
  );
};

export default FormElement;