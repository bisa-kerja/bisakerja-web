"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

/* ─── Mail Check Icon ─── */
function MailCheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9" />
      <polyline points="22 7 13.5 12 2 7" />
      <path d="m16 19 2 2 4-4" />
    </svg>
  );
}

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first empty input on mount
  useEffect(() => {
    const firstEmpty = otp.findIndex((v) => v === "");
    const idx = firstEmpty === -1 ? 5 : firstEmpty;
    inputRefs.current[idx]?.focus();
  }, []);

  const handleChange = useCallback(
    (index: number, value: string) => {
      // Allow only single digit
      if (value && !/^\d$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus forward
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
      if (!pasted) return;
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || "";
      }
      setOtp(newOtp);
      const nextIdx = Math.min(pasted.length, 5);
      inputRefs.current[nextIdx]?.focus();
    },
    [otp]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length === 6) {
      // TODO: verify OTP
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center w-full bg-white" style={{ colorScheme: "light" }}>
      {/* ─── Right Panel ─── */}
      <div className="flex flex-col min-h-screen overflow-y-auto">

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center px-6 sm:px-12 lg:px-0 lg:ml-[72px] w-full max-w-[480px] mx-auto lg:mx-0 lg:max-w-[420px]">
          {/* Step & Progress */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400 font-medium">Step 4 of 4</p>
            <p className="text-xs text-gray-400 font-medium">Verify Email</p>
          </div>
          <div className="flex items-center gap-1.5 mb-10">
            <div className="flex-1 h-[4px] bg-[#2B7FE0] rounded-full" />
            <div className="flex-1 h-[4px] bg-[#2B7FE0] rounded-full" />
            <div className="flex-1 h-[4px] bg-[#2B7FE0] rounded-full" />
            <div className="flex-1 h-[4px] bg-[#2B7FE0] rounded-full" />
          </div>

          {/* Mail icon */}
          <div className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 mb-5">
            <MailCheckIcon />
          </div>

          {/* Title */}
          <h1 className="text-[28px] sm:text-[32px] font-bold text-gray-900 tracking-tight mb-3">
            Verify your email
          </h1>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            We&apos;ve sent a 6-digit security code to{" "}
            <span className="font-semibold text-gray-900">hello@digitalatelier.com</span>.
            {" "}Please enter it below to confirm your identity.
          </p>

          {/* OTP Form */}
          <form onSubmit={handleSubmit}>
            {/* 6-digit OTP inputs with dash separator after 3rd */}
            <div className="flex items-center gap-2.5 mb-8">
              {otp.map((digit, index) => (
                <div key={index} className="contents">
                  {index === 3 && (
                    <span className="text-gray-300 text-lg font-light mx-0.5">–</span>
                  )}
                  <input
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`w-[52px] h-[56px] text-center text-xl font-semibold text-gray-900 border-2 rounded-lg outline-none transition-all duration-200 bg-white ${
                      digit
                        ? "border-gray-300"
                        : "border-gray-200"
                    } focus:border-[#2B7FE0] focus:ring-[3px] focus:ring-[#2B7FE0]/[0.1]`}
                    aria-label={`Digit ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-[50px] border-none rounded-[10px] bg-[#2B7FE0] text-white text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#2470c9] active:scale-[0.99] group"
            >
              Verify &amp; Complete Profile
              <span className="text-base transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
            </button>
          </form>

          {/* Resend */}
          <p className="text-center text-[13px] text-gray-500 mt-5">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              className="text-[#2B7FE0] font-semibold bg-transparent border-none cursor-pointer p-0 hover:text-[#1d6bc4] hover:underline transition-colors text-[13px]"
            >
              Resend code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
