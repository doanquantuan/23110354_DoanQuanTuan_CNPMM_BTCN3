import { useState } from "react";

const InputField = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = "",
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="
            text-gray-700
            font-semibold
            text-lg
          "
        >
          {label}

          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input */}
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`
            w-full
            h-16
            rounded-2xl
            border
            px-6
            text-lg
            bg-white
            border-gray-200
            text-gray-700
            placeholder:text-gray-400
            shadow-sm
            transition-all
            focus:outline-none
            focus:ring-4
            focus:ring-blue-100
            focus:border-blue-500
            disabled:opacity-50
            ${isPassword ? "pr-14" : ""}
            ${
              error
                ? "border-red-400 focus:ring-red-100 focus:border-red-400"
                : ""
            }
          `}
        />

        {/* Toggle password */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute
              right-5
              top-1/2
              -translate-y-1/2
              text-gray-400
              hover:text-gray-600
            "
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

/* Icons */

const EyeIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default InputField;
