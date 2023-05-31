import { SfButton, SfIconAdd, SfIconRemove } from '@storefront-ui/react';
import { useCounter } from 'react-use';
import { useId, ChangeEvent } from 'react';
import { clamp } from '@storefront-ui/shared';
import { classNames } from '~/utils/class-names';

export default function QuantitySelector({
    lineId,
    max,
    min = 1,
    disabled = false,
    adjustOrderLine,
    cssClasses = '',
  }: {
    lineId: string;
    max: number;
    min?: number;
    disabled?: boolean;
    adjustOrderLine?: (lineId: string, quantity: number) => void;
    cssClasses?: string;
  }) {
  const inputId = useId();
  const [value, { inc, dec, set, get }] = useCounter(min);

  const handleOnIncrement = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    inc();
    const currentValue = get();
    if(adjustOrderLine && currentValue) {
      adjustOrderLine(lineId, currentValue);
    }
  }

  const handleOnDecrement = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    dec();
    const currentValue = get();
    if(adjustOrderLine && currentValue) {
      adjustOrderLine(lineId, currentValue);
    }
  }

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value: currentValue } = event.target;
    const nextValue = parseFloat(currentValue);
    set(clamp(nextValue, min, max));
    if(adjustOrderLine && nextValue) {
      adjustOrderLine(lineId, nextValue);
    }
  }
  return (
    <div className={classNames("flex flex-col items-center", cssClasses)}>
      <div className="flex border border-neutral-300 rounded-md">
        <SfButton
          type="button"
          variant="tertiary"
          square
          size="sm"
          className="rounded-r-none"
          disabled={value <= min || disabled}
          aria-controls={inputId}
          aria-label="Decrease value"
          onClick={handleOnDecrement}
        >
          <SfIconRemove />
        </SfButton>
        <input
          id={inputId}
          type="number"
          role="spinbutton"
          className="appearance-none mx-2 w-8 text-center bg-transparent font-medium [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:display-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:display-none [&::-webkit-outer-spin-button]:m-0 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none disabled:placeholder-disabled-900 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm"
          min={min}
          max={max}
          value={value}
          disabled={disabled}
          onChange={handleOnChange}
        />
        <SfButton
          type="button"
          variant="tertiary"
          size="sm"
          square
          className="rounded-l-none"
          disabled={value >= max || disabled}
          aria-controls={inputId}
          aria-label="Increase value"
          onClick={handleOnIncrement}
        >
          <SfIconAdd />
        </SfButton>
      </div>
      {disabled ? (
        <p className="text-negative-700 font-medium text-xs mt-2">Out of stock</p>
      ) : (
        <p className="text-xs mt-2 text-neutral-500">
          <strong className="text-neutral-900">{max}</strong> in stock
        </p>
      )}
    </div>
  );
}
