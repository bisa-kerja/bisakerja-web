"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../public/assets/logo.svg";
import { useAuth } from "@/lib/auth";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Loker", href: "/loker" },
  { label: "AI CV Analyzer", href: "/ai-cv-analyzer" },
];

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowDropdown(false);
    await logout();
    router.push("/");
  };

  return (
    <nav className="flex items-center justify-between px-8 h-[60px] bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <a href="/">
          <Image
            src={logo}
            alt="Logo"
            width={150}
            height={150}
          />
        </a>
        <div className="flex items-center gap-6">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium no-underline transition-colors duration-200 
                  text-gray-600 border-b-2 border-transparent hover:text-blue-600
              `}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {isLoading ? (
          /* Skeleton while checking auth state */
          <div className="w-24 h-9 bg-gray-100 rounded-full animate-pulse" />
        ) : isAuthenticated && user ? (
          /* Logged-in: Avatar dropdown */
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                {user.username.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate hidden sm:inline">
                {user.username}
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 top-[calc(100%+6px)] w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-50">
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.username}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <Link
                  onClick={() => { setShowDropdown(false); }}
                  href="/profile"
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 bg-transparent border-none cursor-pointer hover:bg-gray-50 transition-colors text-left"
                >
                  <UserIcon />
                  Profile
                </Link>
                <div className="border-t border-gray-100 mx-2" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 bg-transparent border-none cursor-pointer hover:bg-red-50 transition-colors text-left"
                >
                  <LogoutIcon />
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Not logged in: Login/Register buttons */
          <>
            <a
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-full border-none text-[13px] font-medium cursor-pointer whitespace-nowrap transition-all duration-200"
            >
              Masuk
            </a>
            <a
              href="/register"
              className="bg-white border border-gray-200 text-blue-600 px-4 py-2 rounded-full text-[13px] font-medium cursor-pointer whitespace-nowrap transition-all duration-200"
            >
              Daftar
            </a>
          </>
        )}
      </div>
    </nav>
  );
}
