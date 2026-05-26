"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { loginUser, APIError } from "@/lib/api";
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
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

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
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
    formState: { errors },
  } = useForm<FormData>({ mode: "onTouched" });

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
        router.push("/");
      } else {
        setApiError(res.message || "Login failed. Please try again.");
      }
    } catch (err) {
      if (err instanceof APIError) {
        if (err.details) {
          if (Array.isArray(err.details) && err.details.length > 0) {
            setApiError(err.details[0].message || err.message);
          } else {
            const fieldErrors = Object.values(err.details).flat();
            if (fieldErrors.length > 0) {
              const firstError = fieldErrors[0];
              setApiError(typeof firstError === 'string' ? firstError : (firstError as any).message || err.message);
            } else {
              setApiError(err.message);
            }
          }
        } else {
          setApiError(err.message);
        }
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
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
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
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
              <Link
                href="/forgot-password"
                className="text-[13px] text-[#1a6fb5] font-semibold no-underline hover:text-[#145a94] hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
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


    </div>
  );
}
