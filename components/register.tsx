"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { registerUser, APIError } from "@/lib/api";
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

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "text-emerald-400"}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}


export default function RegisterStep1() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  type FormData = {
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    terms: boolean;
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ mode: "onTouched" });

  const passwordValue = watch("password");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      const res = await registerUser({
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      if (res.success && res.data) {
        // Auto-login after registration
        login(res.data);
        router.push("/register/onboarding/upload-cv");
      } else {
        setApiError(res.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      if (err instanceof APIError) {
        // Handle specific validation errors
        if (err.details) {
          if (Array.isArray(err.details) && err.details.length > 0) {
            setApiError(err.details[0].message || err.message);
          } else {
            const fieldErrors = Object.values(err.details).flat();
            if (fieldErrors.length > 0) {
              const firstError = fieldErrors[0];
              setApiError(typeof firstError === 'string' ? firstError : (firstError as { message?: string }).message || err.message);
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
        <div className="flex flex-col mt-32 flex-1 px-12 xl:px-16">
          <h2 className="text-white text-[38px] xl:text-[44px] font-bold leading-[1.15] tracking-tight mb-8">
            Start Your<br />
            Career Journey<br />
            With Confidence
          </h2>

          {/* Features list */}
          <div className="flex flex-col gap-4 mb-6">
            {[
              "AI-powered CV analysis for smarter applications",
              "50,000+ curated job listings across Indonesia",
              "Personalized job recommendations",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircleIcon className="text-blue-400" />
                <span className="text-white/80 text-[14px]">{feature}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-2">
            <QuoteIcon />
            <p className="text-white/85 text-[15px] leading-relaxed mt-3 max-w-[420px]">
              &ldquo;Registering was quick and the onboarding process immediately helped me understand my CV&apos;s strengths. Within a week I was getting interview calls!&rdquo;
            </p>

            <div className="flex items-center gap-3.5 mt-5">
              <div>
                <p className="text-white text-[14px] font-semibold">Arman Rizky</p>
                <p className="text-white/60 text-[12px]">Frontend Developer</p>
              </div>
            </div>
          </div>
        </div>

        <Image
          src="/maskots/register.png"
          alt="Nadia Putri"
          width={780}
          height={780}
          className="object-cover absolute -bottom-28 right-0 h-[450px] "
        />

      </div>

      <div className="flex w-full lg:w-[70%] flex-col min-h-screen overflow-y-auto bg-white">
        <div className="flex flex-1 flex-col justify-center px-6 sm:px-12 lg:px-16 w-full max-w-[540px] mx-auto py-10">
          {/* Logo */}
          <div className="mb-8">
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
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight leading-tight mb-1.5">
            Create your account
          </h1>
          <p className="text-[14px] text-gray-500 mb-7 leading-relaxed">
            Start your journey to finding the perfect career opportunity.
          </p>

          {/* API Error */}
          {apiError && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-red-500">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>{apiError}</span>
            </div>
          )}

          <form className="flex flex-col gap-[18px]" onSubmit={handleSubmit(onSubmit)}>
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-[13px] font-semibold text-gray-700">
                Username
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <UserIcon />
                </span>
                <input
                  id="username"
                  type="text"
                  className={`w-full h-[50px] pl-11 pr-4 border rounded-xl text-sm text-gray-900 bg-white outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-[3px] ${errors.username ? "border-red-400 focus:border-red-500 focus:ring-red-500/[0.08]" : "border-gray-200 focus:border-[#1a6fb5] focus:ring-[#1a6fb5]/[0.08]"}`}
                  placeholder="e.g. nadia_putri"
                  disabled={isSubmitting}
                  {...register("username", {
                    required: "Username is required",
                    minLength: { value: 3, message: "Username must be at least 3 characters" },
                  })}
                />
              </div>
              {errors.username && <p className="text-xs text-red-500 mt-0.5">{errors.username.message}</p>}
            </div>

            {/* Email & Phone */}
            <div className="flex flex-col sm:flex-row gap-[18px] sm:gap-3.5">
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <label htmlFor="email" className="text-[13px] font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <MailIcon />
                  </span>
                  <input
                    id="email"
                    type="email"
                    className={`w-full h-[50px] pl-11 pr-4 border rounded-xl text-sm text-gray-900 bg-white outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-[3px] ${errors.email ? "border-red-400 focus:border-red-500 focus:ring-red-500/[0.08]" : "border-gray-200 focus:border-[#1a6fb5] focus:ring-[#1a6fb5]/[0.08]"}`}
                    placeholder="jane@email.com"
                    disabled={isSubmitting}
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
                    })}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <label htmlFor="phoneNumber" className="text-[13px] font-semibold text-gray-700">
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <PhoneIcon />
                  </span>
                  <input
                    id="phoneNumber"
                    type="tel"
                    className={`w-full h-[50px] pl-11 pr-4 border rounded-xl text-sm text-gray-900 bg-white outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-[3px] ${errors.phoneNumber ? "border-red-400 focus:border-red-500 focus:ring-red-500/[0.08]" : "border-gray-200 focus:border-[#1a6fb5] focus:ring-[#1a6fb5]/[0.08]"}`}
                    placeholder="6281234567890"
                    disabled={isSubmitting}
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                      pattern: { value: /^(\+62|62|0)8[1-9][0-9]{6,11}$/, message: "Phone number must be an Indonesian number" },
                    })}
                  />
                </div>
                {errors.phoneNumber && <p className="text-xs text-red-500 mt-0.5">{errors.phoneNumber.message}</p>}
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="flex flex-col sm:flex-row gap-[18px] sm:gap-3.5">
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <label htmlFor="password" className="text-[13px] font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <LockIcon />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={`w-full h-[50px] pl-11 pr-12 border rounded-xl text-sm text-gray-900 bg-white outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-[3px] ${errors.password ? "border-red-400 focus:border-red-500 focus:ring-red-500/[0.08]" : "border-gray-200 focus:border-[#1a6fb5] focus:ring-[#1a6fb5]/[0.08]"}`}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 12, message: "Password must be at least 12 characters" },
                      validate: {
                        hasLowerCase: (value) => /[a-z]/.test(value) || "Password must contain a lowercase letter",
                        hasUpperCase: (value) => /[A-Z]/.test(value) || "Password must contain an uppercase letter",
                        hasSymbol: (value) => /[^a-zA-Z0-9]/.test(value) || "Password must contain a symbol",
                      }
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
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <label htmlFor="confirmPassword" className="text-[13px] font-semibold text-gray-700">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <LockIcon />
                  </span>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className={`w-full h-[50px] pl-11 pr-12 border rounded-xl text-sm text-gray-900 bg-white outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-[3px] ${errors.confirmPassword ? "border-red-400 focus:border-red-500 focus:ring-red-500/[0.08]" : "border-gray-200 focus:border-[#1a6fb5] focus:ring-[#1a6fb5]/[0.08]"}`}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === passwordValue || "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-0.5">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex flex-col mt-1">
              <div className="flex items-start gap-2.5">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 accent-[#1a3a4a] cursor-pointer shrink-0"
                  {...register("terms", { required: "You must agree to the terms" })}
                />
                <label htmlFor="terms" className="text-[13px] text-gray-600 leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#1a6fb5] font-semibold no-underline hover:text-[#145a94] hover:underline transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#1a6fb5] font-semibold no-underline hover:text-[#145a94] hover:underline transition-colors">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
              {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[52px] border-none rounded-xl bg-[#2563eb] text-white text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 mt-1 transition-all duration-200 hover:bg-[#1e40af] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <SpinnerIcon />
                  Creating account...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>


          {/* Login link */}
          <p className="text-center text-[14px] text-gray-500 mt-6 pb-8">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1a6fb5] font-semibold no-underline hover:text-[#145a94] hover:underline transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
