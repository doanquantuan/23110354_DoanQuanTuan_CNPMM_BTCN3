import { useState, useRef, useEffect } from "react";
import { baseButtonClass } from "../components/ui/auth/button";
import { Link, useNavigate } from "react-router-dom";
import { verifyOTPApi } from "../util/api";

const CheckCircleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#16a34a"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const RESEND_SECONDS = 300;
const OTP_LENGTH = 6;

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const VerifyOTPPage = () => {
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [successMsg, setSuccessMsg] = useState(
    "A verification code has been sent successfully.",
  );
  const inputsRef = useRef([]);

  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const handleChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const newOtp = [...otp];
    pasted.split("").forEach((ch, i) => {
      newOtp[i] = ch;
    });
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(RESEND_SECONDS);
    setCanResend(false);
    setSuccessMsg("A verification code has been sent successfully.");
    inputsRef.current[0]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const code = otp.join("");
    const email = localStorage.getItem("email");

    setErrors({});

    if (code.length < OTP_LENGTH) {
      setErrors({
        api: "Vui lòng nhập đầy đủ mã OTP!",
      });
      return;
    }

    try {
      console.log("Verifying OTP with:", {
        email,
        code,
      });

      const res = await verifyOTPApi({
        email,
        code,
      });

      console.log("OTP verification success:", res.data);

      // backend trả về errCode
      if (res.errCode !== 0) {
        setErrors({
          api: res.message,
        });
        return;
      }

      localStorage.removeItem("email");

      navigate("/login");
    } catch (error) {
      console.log(
        "OTP verification error:",
        error.response?.data || error.message,
      );

      setErrors({
        api:
          error.response?.message ||
          error.response?.errMessage ||
          "Có lỗi xảy ra khi xác thực OTP!",
      });
    }

    console.log("OTP submitted:", code);
  };

  const isComplete = otp.every((d) => d !== "");

  return (
    <div className="flex min-h-[50vh] justify-center bg-[#eef2f9] px-4 py-5">
      <div className="w-full max-w-[500px] rounded-[32px] bg-white px-10 pt-10 pb-9 text-left shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <p className="mb-1 text-[18px] text-center font-bold uppercase tracking-[5px] text-blue-600">
          Verify Your Account
        </p>

        <h1 className="mt-[10px] mb-[10px] text-center font-bold text-[2rem] leading-none text-slate-900">
          Enter 6-digit code
        </h1>

        <p className="mb-7 text-[16px] text-center leading-[1.6] text-gray-500">
          We sent an OTP to your email address.
        </p>

        <form onSubmit={handleVerify} className="text-left">
          {errors.api && (
            <p className="text-red-500 text-sm mt-2">{errors.api}</p>
          )}
          <div className="flex justify-center gap-[10px] mb-[28px]">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className={`
                  w-[52px]
                  h-[60px]
                  rounded-[14px]
                  border-2
                  ${digit ? "border-blue-500" : "border-slate-200"}
                  text-[22px]
                  font-bold
                  text-slate-800
                  text-center
                  outline-none
                  bg-white
                  transition-colors
                  box-border
                `}
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`
              ${baseButtonClass}
              font-bold text-white bg-blue-600
              shadow-[0_4px_14px_rgba(37,99,235,0.25)]
              hover:bg-blue-700
              hover:shadow-[0_8px_20px_rgba(37,99,235,0.35)]
              disabled:opacity-60
            `}
          >
            Verify OTP
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            className={`
              ${baseButtonClass}
              flex
              items-center
              justify-center
              gap-3
              border
              border-gray-300
              bg-white
              font-bold
              transition-all
              ${
                canResend
                  ? "text-black hover:bg-blue-50 cursor-pointer"
                  : "text-gray-400 cursor-not-allowed opacity-70"
              }
            `}
          >
            <span>
              {canResend ? "Resend OTP" : `Resend OTP (${formatTime(timer)})`}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
