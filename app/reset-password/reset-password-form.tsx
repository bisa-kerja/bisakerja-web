"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { APIError, resetPassword } from "@/lib/api";

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-green-500">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 16H10C8.9 16 8 16.9 8 18V28C8 29.1 8.9 30 10 30H16L12 36H16L20 30V18C20 16.9 19.1 16 18 16H20Z" fill="rgba(255,255,255,0.3)" />
      <path d="M40 16H30C28.9 16 28 16.9 28 18V28C28 29.1 28.9 30 30 30H36L32 36H36L40 30V18C40 16.9 39.1 16 38 16H40Z" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}

function getErrorMessage(err: unknown, fallback: string) {
  if (err instanceof APIError) {
    if (err.status === 429) {
      return "Too many attempts. Please wait a moment before trying again.";
    }

    if (Array.isArray(err.details) && err.details.length > 0) {
      return err.details[0].message || err.message || fallback;
    }

    if (err.details && typeof err.details === "object") {
      const fieldErrors = Object.values(err.details).flat();
      if (fieldErrors.length > 0) {
        const firstError = fieldErrors[0];
        return typeof firstError === "string"
          ? firstError
          : (firstError as { message?: string }).message || err.message || fallback;
      }
    }

    return err.message || fallback;
  }

  return fallback;
}

type ResetPasswordFormProps = {
  initialToken: string;
};

export default function ResetPasswordForm({ initialToken }: ResetPasswordFormProps) {
  const [token] = useState(initialToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const missingTokenError = !token
    ? "This reset link is missing a token. Please request a new reset email."
    : null;
  const visibleError = error || missingTokenError;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedToken = token.trim();

    if (trimmedToken.length < 32) {
      setError("This reset link is invalid or expired. Please request a new reset email.");
      return;
    }

    if (newPassword.length < 12) {
      setError("New password must be at least 12 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const res = await resetPassword({
        token: trimmedToken,
        password: newPassword,
        confirmPassword,
      });

      setMessage(res.message || "Password reset successful. You can sign in now.");
      setNewPassword("");
      setConfirmPassword("");
      window.setTimeout(() => router.push("/login"), 1600);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to reset password. Please request a new reset email and try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900" style={{ colorScheme: "light" }}>

      <div className="flex w-full flex-col min-h-screen overflow-y-auto bg-white">
        <div className="flex flex-1 flex-col justify-center px-6 sm:px-12 lg:px-16 w-full max-w-[540px] mx-auto">
          <div className="mb-10">
            <Link href="/">
              <Image
                src="/assets/logo.svg"
                alt="BisaKerja"
                width={140}
                height={40}
                priority
              />
            </Link>
          </div>

          <h1 className="text-[32px] font-bold text-gray-900 tracking-tight leading-tight mb-2">
            Create New Password
          </h1>
          <p className="text-[15px] text-gray-500 mb-8 leading-relaxed">
            Enter a new password for your account. The reset token from your email link will be used automatically.
          </p>

          {visibleError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-red-500">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>{visibleError}</span>
            </div>
          )}

          {message && !visibleError && (
            <div className="mb-5 p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-start gap-2.5">
              <CheckCircleIcon />
              <span>{message}</span>
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="new-password" className="text-[13px] font-semibold text-gray-700">
                New password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <LockIcon />
                </span>
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError(null);
                  }}
                  className="w-full h-[50px] pl-11 pr-12 border rounded-xl text-sm text-gray-900 bg-white outline-none transition-all duration-200 placeholder:text-gray-400 border-gray-200 focus:border-[#1a6fb5] focus:ring-[3px] focus:ring-[#1a6fb5]/[0.08]"
                  placeholder="At least 12 characters"
                  disabled={isSubmitting || !token}
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center p-0"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                >
                  {showNewPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirm-new-password" className="text-[13px] font-semibold text-gray-700">
                Confirm password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <LockIcon />
                </span>
                <input
                  id="confirm-new-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError(null);
                  }}
                  className="w-full h-[50px] pl-11 pr-12 border rounded-xl text-sm text-gray-900 bg-white outline-none transition-all duration-200 placeholder:text-gray-400 border-gray-200 focus:border-[#1a6fb5] focus:ring-[3px] focus:ring-[#1a6fb5]/[0.08]"
                  placeholder="Repeat your new password"
                  disabled={isSubmitting || !token}
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                >
                  {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !token}
              className="w-full h-[52px] border-none rounded-xl bg-[#2563eb] text-white text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#1e40af] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <SpinnerIcon />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <p className="text-center text-[14px] text-gray-500 mt-8 pb-8">
            Remember your password?{" "}
            <Link href="/login" className="text-[#1a6fb5] font-semibold no-underline hover:text-[#145a94] hover:underline transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
