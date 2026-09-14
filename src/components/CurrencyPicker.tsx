'use client';

export const DISPLAY_CURRENCIES = ['USD', 'EUR', 'GBP'] as const;
export type DisplayCurrency = (typeof DISPLAY_CURRENCIES)[number];

interface CurrencyPickerProps {
  value: DisplayCurrency;
  onChange: (currency: DisplayCurrency) => void;
}

export default function CurrencyPicker({ value, onChange }: CurrencyPickerProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="display-currency" className="text-sm font-semibold text-gray-800">
        Currency
      </label>
      <select
        id="display-currency"
        value={value}
        onChange={(event) => onChange(event.target.value as DisplayCurrency)}
        className="input-base"
      >
        {DISPLAY_CURRENCIES.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-600">Currency is display only. Tax rules on this page are US.</p>
    </div>
  );
}
