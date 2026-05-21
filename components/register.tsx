"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { registerUser, APIError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

/* ─── SVG Icons ─── */
function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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

  console.log(apiError)

  return (
    <div className="flex min-h-screen bg-white text-gray-900" style={{ colorScheme: "light" }}>
      {/* ─── Left Panel ─── */}
      <div className="relative hidden w-1/2 min-h-screen overflow-hidden lg:block">
        <Image
          src="/assets/onboarding/hero.png"
          alt="Creative studio workspace"
          fill
          className="object-cover brightness-75 saturate-[0.6] sepia-[0.35]"
          priority
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        {/* Text overlay */}
        <div className="absolute bottom-[60px] left-12 right-12 z-[2] text-white">
          <h2 className="text-[26px] font-bold leading-[1.35] tracking-tight mb-3.5">
            Shape the next generation
            <br />
            of creative talent.
          </h2>
          <p className="text-[13.5px] leading-[1.65] text-white/80 max-w-[380px]">
            Join the Digital Atelier network as a mentor. Provide editorial
            precision and expert guidance to emerging professionals looking to
            refine their craft.
          </p>
        </div>
      </div>

      {/* ─── Right Panel ─── */}
      <div className="flex flex-1 flex-col min-h-screen overflow-y-auto">
        {/* Form Area */}
        <div className="flex flex-1 flex-col justify-center px-5 sm:px-10 lg:px-0 lg:ml-[72px] w-full max-w-[520px] mx-auto lg:mx-0 lg:max-w-[460px]">
          {/* Step & Progress */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400 font-medium">Step 1 of 4</p>
            <p className="text-xs text-gray-400 font-medium">Create Account</p>
          </div>
          <div className="flex items-center gap-1.5 mb-8">
            <div className="flex-1 h-[4px] rounded-full overflow-hidden bg-gray-200 relative">
              <div className="absolute inset-y-0 left-0 w-full bg-[#2B7FE0] rounded-full" />
            </div>
            <div className="flex-1 h-[4px] bg-gray-200 rounded-full" />
            <div className="flex-1 h-[4px] bg-gray-200 rounded-full" />
            <div className="flex-1 h-[4px] bg-gray-200 rounded-full" />
          </div>

          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-2">
            Create your account
          </h1>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Let&apos;s set up your foundational details for your mentor profile.
          </p>

          {/* API Error */}
          {apiError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
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
              <label htmlFor="username" className="text-[13px] font-semibold text-gray-900">
                Username
              </label>
              <div className="relative flex items-center">
                <input
                  id="username"
                  type="text"
                  className={`w-full h-11 px-3.5 border rounded-lg text-sm text-gray-900 bg-white outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-[3px] ${errors.username ? "border-red-500 focus:border-red-500 focus:ring-red-500/[0.08]" : "border-gray-300 focus:border-[#2B7FE0] focus:ring-[#2B7FE0]/[0.08]"}`}
                  placeholder="e.g. creative_director_jane"
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
                <label htmlFor="email" className="text-[13px] font-semibold text-gray-900">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <input
                    id="email"
                    type="email"
                    className={`w-full h-11 px-3.5 border rounded-lg text-sm text-gray-900 bg-white outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-[3px] ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/[0.08]" : "border-gray-300 focus:border-[#2B7FE0] focus:ring-[#2B7FE0]/[0.08]"}`}
                    placeholder="jane@studio.com"
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
                <label htmlFor="phoneNumber" className="text-[13px] font-semibold text-gray-900">
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <input
                    id="phoneNumber"
                    type="tel"
                    className={`w-full h-11 px-3.5 border rounded-lg text-sm text-gray-900 bg-white outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-[3px] ${errors.phoneNumber ? "border-red-500 focus:border-red-500 focus:ring-red-500/[0.08]" : "border-gray-300 focus:border-[#2B7FE0] focus:ring-[#2B7FE0]/[0.08]"}`}
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
                <label htmlFor="password" className="text-[13px] font-semibold text-gray-900">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={`w-full h-11 px-3.5 pr-10 border rounded-lg text-sm text-gray-900 bg-white outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-[3px] ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/[0.08]" : "border-gray-300 focus:border-[#2B7FE0] focus:ring-[#2B7FE0]/[0.08]"}`}
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-500 transition-colors flex items-center justify-center p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-0.5">{errors.password.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <label htmlFor="confirmPassword" className="text-[13px] font-semibold text-gray-900">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className={`w-full h-11 px-3.5 pr-10 border rounded-lg text-sm text-gray-900 bg-white outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-[3px] ${errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500/[0.08]" : "border-gray-300 focus:border-[#2B7FE0] focus:ring-[#2B7FE0]/[0.08]"}`}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === passwordValue || "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-500 transition-colors flex items-center justify-center p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-0.5">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex flex-col mt-1.5">
              <div className="flex items-start gap-2.5">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 accent-[#2B7FE0] cursor-pointer shrink-0"
                  {...register("terms", { required: "You must agree to the terms" })}
                />
                <label htmlFor="terms" className="text-[13px] text-gray-600 leading-relaxed">
                  I agree to the{" "}
                  <a href="/terms" className="text-[#2B7FE0] font-semibold no-underline hover:text-[#1d6bc4] hover:underline transition-colors">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-[#2B7FE0] font-semibold no-underline hover:text-[#1d6bc4] hover:underline transition-colors">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
              {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 border-none rounded-[10px] bg-[#2B7FE0] text-white text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 mt-2.5 transition-all duration-200 hover:bg-[#2470c9] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed group"
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
          <p className="text-center text-[13px] text-gray-500 mt-5 pb-10">
            Already have an account?{" "}
            <a href="/login" className="text-[#2B7FE0] font-semibold no-underline hover:text-[#1d6bc4] hover:underline transition-colors">
              Log in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
