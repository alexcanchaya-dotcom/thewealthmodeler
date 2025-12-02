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
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      <div className="relative">
        <input
          type={type}
          step={step}
          placeholder={placeholder}
          className={clsx('input-base pr-12', error && 'border-red-300 ring-2 ring-red-100')}
          {...register}
        />
        {suffix && <span className="absolute inset-y-0 right-4 flex items-center text-sm text-gray-500">{suffix}</span>}
      </div>
      {error && <p className="text-xs font-semibold text-red-500">{error.message}</p>}
    </div>
  );
}
