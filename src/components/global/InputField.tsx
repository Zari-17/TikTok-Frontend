import React, { InputHTMLAttributes } from "react";

interface InputFieldProps {
  label?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: any;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  fieldProps?: InputHTMLAttributes<HTMLInputElement>;
  startView?: any;
}

const InputField: React.FC<InputFieldProps> = ({
  handleBlur,
  label,
  name,
  placeholder,
  value,
  onChange,
  fieldProps = {},
  error,
  startView,
}) => {
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center">
        <label htmlFor={name} className="block text-white ">
          {label}
        </label>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <div className="bg-app-gray rounded-md overflow-hidden w-full flex flex-col p-2 ">
        <div>{startView}</div>
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          value={value}
          onBlur={handleBlur}
          onChange={onChange}
          className={`w-full bg-app-gray  placeholder-neutral-300 focus:outline-none ${
            error ? "border-red-500" : ""
          }`}
          {...fieldProps}
        />
      </div>
    </div>
  );
};

export default InputField;
