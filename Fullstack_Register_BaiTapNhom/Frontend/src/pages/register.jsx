import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import { EyeIcon, EyeOffIcon } from "../components/ui/auth/icons";
import { InputField } from "../components/ui/auth/input";
import { PasswordStrength } from "../components/ui/auth/password-strength";
import { baseButtonClass } from "../components/ui/auth/button";
import { createUserApi } from "../util/api";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });

    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validate = () => {
    const errs = {};

    if (!form.fullName.trim()) {
      errs.fullName = "Full name is required";
    }

    if (!form.email.trim()) {
      errs.email = "Email is required";
    }

    if (!form.password) {
      errs.password = "Password is required";
    } else if (form.password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }

    if (form.confirmPassword !== form.password) {
      errs.confirmPassword = "Passwords do not match";
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      const res = await createUserApi({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });

      if (res.errCode !== 0) {
        setErrors({
          api: res.message,
        });

        return;
      }

      localStorage.setItem("email", form.email);

      // reset form
      setForm({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/verify-otp");
    } catch (error) {
      console.log("Register error:", error.response?.data || error.message);

      setErrors({
        api: error.response?.data?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] justify-center bg-[#eef2f9] px-4 py-5">
      <div className="w-full max-w-[500px] rounded-[32px] bg-white px-10 pt-10 pb-9 text-left shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <p className="mb-1 text-left text-[18px] font-bold uppercase tracking-[5px] text-blue-600">
          Create Account
        </p>

        <h1 className="mt-[10px] mb-[10px] font-bold text-left text-[2rem] leading-none text-slate-900">
          Start learning today
        </h1>

        <p className="mb-7 text-left text-[16px] leading-[1.6] text-gray-500">
          Create your account to save progress and access premium courses.
        </p>

        <form onSubmit={handleSubmit} className="text-left">
          {errors.api && (
            <p className="mb-3 text-sm text-red-500">{errors.api}</p>
          )}

          <InputField
            id="fullName"
            label="Full Name"
            placeholder="Nguyen Van A"
            value={form.fullName}
            onChange={handleChange("fullName")}
            error={errors.fullName}
          />

          <InputField
            id="email"
            type="email"
            label="Email"
            placeholder="name@example.com"
            value={form.email}
            onChange={handleChange("email")}
            error={errors.email}
          />

          {/* Password */}
          <div className="mb-5">
            <label className="mb-[6px] block text-[14px] font-bold text-slate-900">
              Password
            </label>

            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange("password")}
                className={`block h-[40px] w-full rounded-[14px] border-[1.5px] pl-4 pr-[44px] text-[15px] outline-none transition-all
                  ${
                    errors.password
                      ? "border-red-500"
                      : "border-slate-200 focus:border-blue-500"
                  }`}
              />

              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-[14px] top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPwd ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-[5px] text-[12px] text-red-500">
                {errors.password}
              </p>
            )}

            <PasswordStrength password={form.password} />
          </div>

          <InputField
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            error={errors.confirmPassword}
            showToggle
            showPassword={showConfirm}
            onToggle={() => setShowConfirm(!showConfirm)}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`
              ${baseButtonClass}
              font-bold text-white bg-blue-600
              shadow-[0_4px_14px_rgba(37,99,235,0.25)]
              hover:bg-blue-700
              hover:shadow-[0_8px_20px_rgba(37,99,235,0.35)]
              disabled:opacity-60
            `}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-gray-200" />
            <span className="text-sm text-gray-400">or</span>
            <div className="h-[1px] flex-1 bg-gray-200" />
          </div>

          {/* Google button */}
          <button
            type="button"
            className={`${baseButtonClass} flex items-center justify-center gap-3 border-gray-300 bg-white text-black hover:bg-blue-50`}
          >
            <FcGoogle size={20} />
            <span>Sign up with Google</span>
          </button>
        </form>

        <p className="mt-5 text-center text-[15px] text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
