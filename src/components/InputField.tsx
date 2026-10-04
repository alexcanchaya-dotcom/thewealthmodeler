import { useId } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import clsx from 'clsx';

interface InputFieldProps {
  label: string;
  type?: string;
  step?: string | number;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  suffix?: string;
}

export default function InputField({ label, type = 'number', step, placeholder, register, error, suffix }: InputFieldProps) {
  // Stable per-field id so the <label> is programmatically tied to its <input>.
  const inputId = useId();
  const errorId = `${inputId}-error`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium text-white/90">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={type}
          step={step}
          placeholder={placeholder}
          className={clsx('input-base pr-12', error && 'border-red-400/60 ring-2 ring-red-500/25')}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...register}
        />
        {suffix && <span className="absolute inset-y-0 right-4 flex items-center text-sm text-ink-muted">{suffix}</span>}
      </div>
      {error && (
        <p id={errorId} className="text-xs font-semibold text-red-300">
          {error.message}
        </p>
      )}
    </div>
  );
}
