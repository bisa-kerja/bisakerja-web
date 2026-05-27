"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { loginUser, forgotPassword, resetPassword, APIError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

/* ─── SVG Icons ─── */
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

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
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

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RecoveryMode = "request" | "reset";

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

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState<RecoveryMode>("request");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRecoverySubmitting, setIsRecoverySubmitting] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  type FormData = {
    email: string;
    password: string;
    remember: boolean;
  };

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({ mode: "onTouched" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || params.get("resetToken");
    const email = params.get("email");

    if (!email && !token) return;

    const timeoutId = window.setTimeout(() => {
      if (email) setRecoveryEmail(email);
      if (token) {
        setResetToken(token);
        setRecoveryMode("reset");
        setIsRecoveryOpen(true);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const openRecoveryDialog = () => {
    const currentEmail = getValues("email");
    if (currentEmail && EMAIL_PATTERN.test(currentEmail)) {
      setRecoveryEmail(currentEmail);
    }
    setRecoveryError(null);
    setRecoveryMessage(null);
    setRecoveryMode(resetToken ? "reset" : "request");
    setIsRecoveryOpen(true);
  };

  const closeRecoveryDialog = () => {
    if (isRecoverySubmitting) return;
    setIsRecoveryOpen(false);
    setRecoveryError(null);
    setRecoveryMessage(null);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      const res = await loginUser({
        email: data.email,
        password: data.password,
      });
      if (res.success && res.data) {
        login(res.data);
        router.push("/jobs");
      } else {
        setApiError(res.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setApiError(getErrorMessage(err, "An unexpected error occurred. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = recoveryEmail.trim();

    if (!EMAIL_PATTERN.test(email)) {
      setRecoveryError("Enter a valid email address.");
      return;
    }

    setIsRecoverySubmitting(true);
    setRecoveryError(null);
    setRecoveryMessage(null);

    try {
      const res = await forgotPassword({ email });
      setRecoveryMessage(
        res.message || "If the email is registered, password reset instructions will be sent.",
      );
    } catch (err) {
      setRecoveryError(getErrorMessage(err, "Unable to send reset instructions. Please try again."));
    } finally {
      setIsRecoverySubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = resetToken.trim();
    const password = newPassword;
    const confirmation = confirmPassword;

    if (token.length < 32) {
      setRecoveryError("Enter the reset token from your email.");
      return;
    }

    if (password.length < 12) {
      setRecoveryError("New password must be at least 12 characters.");
      return;
    }

    if (password !== confirmation) {
      setRecoveryError("Password confirmation does not match.");
      return;
    }

    setIsRecoverySubmitting(true);
    setRecoveryError(null);
    setRecoveryMessage(null);

    try {
      const res = await resetPassword({
        token,
        password,
        confirmPassword: confirmation,
      });
      setRecoveryMessage(res.message || "Password reset successful. You can sign in now.");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setIsRecoveryOpen(false);
      }, 1400);
    } catch (err) {
      setRecoveryError(getErrorMessage(err, "Unable to reset password. Please check your token and try again."));
    } finally {
      setIsRecoverySubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900" style={{ colorScheme: "light" }}>

      <div
        className="relative hidden lg:flex w-[30%] min-h-screen flex-col justify-between overflow-hidden"
       style={{ background: "linear-gradient(135deg, #1e40af 0%, #2563eb 35%, #3b82f6 65%, #60a5fa 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />

        {/* Main content */}
        <div className="flex flex-col mt-42 flex-1 px-12 xl:px-16">
          <h2 className="text-white text-[38px] xl:text-[44px] font-bold leading-[1.15] tracking-tight mb-10">
            Find the Career<br />
            That Matches<br />
            Your Potential
          </h2>

          {/* Testimonial */}
          <div className="mt-2">
            <QuoteIcon />
            <p className="text-white/85 text-[16px] leading-relaxed mt-3 max-w-[440px]">
              &ldquo;BisaKerja helped me discover opportunities I never knew existed. The AI CV analysis gave me clear direction on how to improve my applications — I landed my dream job in just 3 weeks!&rdquo;
            </p>

            <div className="flex items-center gap-3.5 mt-6">
              <div>
                <p className="text-white text-[14px] font-semibold">Nadia Putri</p>
                <p className="text-white/60 text-[13px]">Fresh Graduate, UI/UX Designer</p>
              </div>
            </div>

            <Image
                src="/maskots/login.png"
                alt="Nadia Putri"
                width={780}
                height={780}
                className="object-cover absolute -bottom-42 right-0 h-[450px] "
              />
          </div>
        </div>

      </div>
      {/* ─── Left Panel: Form ─── */}
      <div className="flex w-full lg:w-[70%] flex-col min-h-screen overflow-y-auto bg-white">
        <div className="flex flex-1 flex-col justify-center px-6 sm:px-12 lg:px-16 w-full max-w-[540px] mx-auto">
          {/* Logo */}
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

          {/* Heading */}
          <h1 className="text-[32px] font-bold text-gray-900 tracking-tight leading-tight mb-2">
            Welcome Back!
          </h1>
          <p className="text-[15px] text-gray-500 mb-8 leading-relaxed">
            Sign in to access your dashboard and continue<br className="hidden sm:block" /> exploring the best job opportunities.
          </p>

          {/* API Error */}
          {apiError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-red-500">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>{apiError}</span>
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-[13px] font-semibold text-gray-700">
                Email
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <MailIcon />
                </span>
                <input
                  id="login-email"
                  type="email"
                  className={`w-full h-[50px] pl-11 pr-4 border rounded-xl text-sm text-gray-900 bg-white outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-[3px] ${errors.email ? "border-red-400 focus:border-red-500 focus:ring-red-500/[0.08]" : "border-gray-200 focus:border-[#1a6fb5] focus:ring-[#1a6fb5]/[0.08]"}`}
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address" },
                  })}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-[13px] font-semibold text-gray-700">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <LockIcon />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full h-[50px] pl-11 pr-12 border rounded-xl text-sm text-gray-900 bg-white outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-[3px] ${errors.password ? "border-red-400 focus:border-red-500 focus:ring-red-500/[0.08]" : "border-gray-200 focus:border-[#1a6fb5] focus:ring-[#1a6fb5]/[0.08]"}`}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center p-0"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-0.5">{errors.password.message}</p>}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end -mt-1">
              <button
                type="button"
                onClick={openRecoveryDialog}
                className="bg-transparent border-none p-0 cursor-pointer text-[13px] text-[#1a6fb5] font-semibold no-underline hover:text-[#145a94] hover:underline transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[52px] border-none rounded-xl bg-[#2563eb] text-white text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#1e40af] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <SpinnerIcon />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          {/* Register link */}
          <p className="text-center text-[14px] text-gray-500 mt-8 pb-8">
            Don&apos;t have an Account?{" "}
            <Link href="/register" className="text-[#1a6fb5] font-semibold no-underline hover:text-[#145a94] hover:underline transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {isRecoveryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/45 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="password-recovery-title"
        >
          <div className="w-full max-w-[440px] rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-gray-100">
              <div>
                <h2 id="password-recovery-title" className="text-[22px] font-bold text-gray-900 tracking-tight">
                  {recoveryMode === "request" ? "Reset your password" : "Create new password"}
                </h2>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {recoveryMode === "request"
                    ? "Enter your account email and we will send reset instructions."
                    : "Use the reset token from your email to set a new password."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeRecoveryDialog}
                disabled={isRecoverySubmitting}
                className="h-9 w-9 rounded-full border border-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-50 hover:text-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label="Close password recovery"
              >
                <XIcon />
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryMode("request");
                    setRecoveryError(null);
                    setRecoveryMessage(null);
                  }}
                  className={`h-10 rounded-lg text-sm font-semibold transition-colors ${recoveryMode === "request" ? "bg-white text-[#1a6fb5] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryMode("reset");
                    setRecoveryError(null);
                    setRecoveryMessage(null);
                  }}
                  className={`h-10 rounded-lg text-sm font-semibold transition-colors ${recoveryMode === "reset" ? "bg-white text-[#1a6fb5] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  New Password
                </button>
              </div>

              {recoveryError && (
                <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-red-500">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  <span>{recoveryError}</span>
                </div>
              )}

              {recoveryMessage && !recoveryError && (
                <div className="mb-4 p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-start gap-2.5">
                  <CheckCircleIcon />
                  <span>{recoveryMessage}</span>
                </div>
              )}

              {recoveryMode === "request" ? (
                <form className="flex flex-col gap-4" onSubmit={handleForgotPassword}>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="recovery-email" className="text-[13px] font-semibold text-gray-700">
                      Email
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <MailIcon />
                      </span>
                      <input
                        id="recovery-email"
                        type="email"
                        value={recoveryEmail}
                        onChange={(e) => {
                          setRecoveryEmail(e.target.value);
                          setRecoveryError(null);
                        }}
                        className="w-full h-[50px] pl-11 pr-4 border rounded-xl text-sm text-gray-900 bg-white outline-none transition-all duration-200 placeholder:text-gray-400 border-gray-200 focus:border-[#1a6fb5] focus:ring-[3px] focus:ring-[#1a6fb5]/[0.08]"
                        placeholder="Enter your email"
                        disabled={isRecoverySubmitting}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isRecoverySubmitting}
                    className="w-full h-[50px] border-none rounded-xl bg-[#2563eb] text-white text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#1e40af] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isRecoverySubmitting ? (
                      <>
                        <SpinnerIcon />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Email"
                    )}
                  </button>
                </form>
              ) : (
                <form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="reset-token" className="text-[13px] font-semibold text-gray-700">
                      Reset token
                    </label>
                    <input
                      id="reset-token"
                      type="text"
                      value={resetToken}
                      onChange={(e) => {
                        setResetToken(e.target.value);
                        setRecoveryError(null);
                      }}
                      className="w-full h-[50px] px-4 border rounded-xl text-sm text-gray-900 bg-white outline-none transition-all duration-200 placeholder:text-gray-400 border-gray-200 focus:border-[#1a6fb5] focus:ring-[3px] focus:ring-[#1a6fb5]/[0.08]"
                      placeholder="Paste your reset token"
                      disabled={isRecoverySubmitting}
                    />
                  </div>

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
                          setRecoveryError(null);
                        }}
                        className="w-full h-[50px] pl-11 pr-12 border rounded-xl text-sm text-gray-900 bg-white outline-none transition-all duration-200 placeholder:text-gray-400 border-gray-200 focus:border-[#1a6fb5] focus:ring-[3px] focus:ring-[#1a6fb5]/[0.08]"
                        placeholder="At least 12 characters"
                        disabled={isRecoverySubmitting}
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
                          setRecoveryError(null);
                        }}
                        className="w-full h-[50px] pl-11 pr-12 border rounded-xl text-sm text-gray-900 bg-white outline-none transition-all duration-200 placeholder:text-gray-400 border-gray-200 focus:border-[#1a6fb5] focus:ring-[3px] focus:ring-[#1a6fb5]/[0.08]"
                        placeholder="Repeat your new password"
                        disabled={isRecoverySubmitting}
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
                    disabled={isRecoverySubmitting}
                    className="w-full h-[50px] border-none rounded-xl bg-[#2563eb] text-white text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#1e40af] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isRecoverySubmitting ? (
                      <>
                        <SpinnerIcon />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
