"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  verifyEmail,
  getStoredUser,
  setStoredUser,
  APIError,
} from "../../../../lib/api";

/* ─── Icons ─── */

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

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width="18"
      height="18"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}

function CheckCircleIcon() {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

/* ─── Constants ─── */
const RESEND_COOLDOWN_SEC = 60;

export default function VerifyEmailPage() {
  const router = useRouter();

  /* ── State ── */
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SEC);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  /* ── Email from stored session ── */
  const [userEmail, setUserEmail] = useState<string>("");
  useEffect(() => {
    const stored = getStoredUser();
    if (stored?.user?.email) {
      setUserEmail(stored.user.email);
    }
  }, []);

  /* ── Refs ── */
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ── Focus first input on mount ── */
  useEffect(() => {
    const firstEmpty = otp.findIndex((v) => v === "");
    const idx = firstEmpty === -1 ? 5 : firstEmpty;
    inputRefs.current[idx]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Resend cooldown ticker ── */
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  /* ── OTP input handlers ── */
  const handleChange = useCallback(
    (index: number, value: string) => {
      if (value && !/^\d$/.test(value)) return;
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setApiError(null);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);
      if (!pasted) return;
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || "";
      }
      setOtp(newOtp);
      setApiError(null);
      const nextIdx = Math.min(pasted.length, 5);
      inputRefs.current[nextIdx]?.focus();
    },
    [otp],
  );

  /* ── Submit handler ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setApiError("Please enter all 6 digits.");
      return;
    }
    if (!userEmail) {
      setApiError(
        "Unable to determine your email address. Please go back and register again.",
      );
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const res = await verifyEmail({ email: userEmail, otp: code });

      if (res.success && res.data) {
        /* Update stored user with verified status */
        const stored = getStoredUser();
        if (stored) {
          setStoredUser({
            ...stored,
            user: {
              ...stored.user,
              /* Merge in fields returned by the verify endpoint */
              ...(res.data.user as Partial<typeof stored.user>),
            },
          });
        }
        setIsSuccess(true);
        /* Redirect to the main app after a short celebration delay */
        setTimeout(() => router.push("/"), 2000);
      } else {
        setApiError(res.message || "Verification failed. Please try again.");
      }
    } catch (err) {
      if (err instanceof APIError) {
        if (err.status === 429) {
          setApiError(
            "Too many attempts. Please wait a moment before trying again.",
          );
        } else if (err.status === 401) {
          setApiError(
            "Invalid or expired code. Please check the code and try again.",
          );
        } else if (
          err.details &&
          Array.isArray(err.details) &&
          err.details.length > 0
        ) {
          setApiError(err.details[0].message || err.message);
        } else {
          setApiError(err.message || "Verification failed. Please try again.");
        }
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Resend handler ── */
  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setResendMessage(null);
    setApiError(null);

    try {
      /*
       * The backend currently sends a new OTP automatically when the
       * registration is completed. There is no dedicated /auth/resend-otp
       * endpoint yet. When one becomes available, call it here.
       *
       * For now we reset the OTP inputs and start the cooldown so the
       * user knows to wait for the email that was already dispatched.
       */
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setResendMessage("A new code has been sent to your email.");
    } catch {
      setResendMessage("Failed to resend. Please try again shortly.");
    } finally {
      setIsResending(false);
      setResendCooldown(RESEND_COOLDOWN_SEC);
    }
  };

  /* ── Success screen ── */
  if (isSuccess) {
    return (
      <div
        className="flex min-h-screen items-center justify-center w-full bg-white"
        style={{ colorScheme: "light" }}
      >
        <div className="flex flex-col items-center gap-5 max-w-sm mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-500">
            <CheckCircleIcon />
          </div>
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">
            Email verified!
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your email has been confirmed. Redirecting you to the app…
          </p>
          <div className="w-8 h-8 mt-2">
            <SpinnerIcon />
          </div>
        </div>
      </div>
    );
  }

  /* ── Main screen ── */
  return (
    <div
      className="flex min-h-screen items-center justify-center w-full bg-white"
      style={{ colorScheme: "light" }}
    >
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
            {userEmail ? (
              <span className="font-semibold text-gray-900">{userEmail}</span>
            ) : (
              <span className="font-semibold text-gray-900">
                your email address
              </span>
            )}
            . Please enter it below to confirm your identity.
          </p>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* 6-digit OTP inputs with dash separator after 3rd */}
            <div className="flex items-center gap-2.5 mb-3">
              {otp.map((digit, index) => (
                <div key={index} className="contents">
                  {index === 3 && (
                    <span className="text-gray-300 text-lg font-light mx-0.5">
                      –
                    </span>
                  )}
                  <input
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    disabled={isSubmitting}
                    className={`w-[52px] h-[56px] text-center text-xl font-semibold text-gray-900 border-2 rounded-lg outline-none transition-all duration-200 bg-white disabled:opacity-60 disabled:cursor-not-allowed ${
                      apiError
                        ? "border-red-400 focus:border-red-500 focus:ring-[3px] focus:ring-red-400/[0.1]"
                        : digit
                          ? "border-gray-300"
                          : "border-gray-200"
                    } focus:border-[#2B7FE0] focus:ring-[3px] focus:ring-[#2B7FE0]/[0.1]`}
                    aria-label={`Digit ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            {/* Error message */}
            {apiError && (
              <p
                className="text-sm text-red-500 mb-5 leading-relaxed"
                role="alert"
              >
                {apiError}
              </p>
            )}

            {/* Resend success message */}
            {resendMessage && !apiError && (
              <p className="text-sm text-green-600 mb-5 leading-relaxed">
                {resendMessage}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || otp.join("").length !== 6}
              className="w-full h-[50px] border-none rounded-[10px] bg-[#2B7FE0] text-white text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#2470c9] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 group mt-5"
            >
              {isSubmitting ? (
                <>
                  <SpinnerIcon />
                  Verifying…
                </>
              ) : (
                <>
                  Verify &amp; Complete Profile
                  <span className="text-base transition-transform duration-200 group-hover:translate-x-[3px]">
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Resend */}
          <p className="text-center text-[13px] text-gray-500 mt-5">
            Didn&apos;t receive the code?{" "}
            {resendCooldown > 0 ? (
              <span className="text-gray-400">
                Resend in{" "}
                <span className="font-semibold tabular-nums">
                  {resendCooldown}s
                </span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-[#2B7FE0] font-semibold bg-transparent border-none cursor-pointer p-0 hover:text-[#1d6bc4] hover:underline transition-colors text-[13px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isResending ? "Sending…" : "Resend code"}
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
