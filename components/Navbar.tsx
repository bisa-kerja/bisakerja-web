"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../public/assets/logo.svg";
import { useAuth } from "@/lib/auth";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Job Board", href: "/jobs" },
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

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseMenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu on route change / resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    setShowDropdown(false);
    setMobileMenuOpen(false);
    await logout();
    router.push("/");
  };

  return (
    <nav className="relative bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-8 h-[60px]">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <a href="/">
            <Image
              src={logo}
              alt="Logo"
              width={130}
              height={130}
              className="md:w-[150px]"
            />
          </a>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
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

        {/* Desktop auth buttons + hamburger */}
        <div className="flex items-center gap-3">
          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="w-24 h-9 bg-gray-100 rounded-full animate-pulse" />
            ) : isAuthenticated && user ? (
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
              <>
                <a
                  href="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md border-none text-[13px] font-medium cursor-pointer whitespace-nowrap transition-all duration-200"
                >
                  Masuk
                </a>
                <a
                  href="/register"
                  className="bg-white border border-gray-200 text-blue-600 px-4 py-2 rounded-md text-[13px] font-medium cursor-pointer whitespace-nowrap transition-all duration-200"
                >
                  Daftar
                </a>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <CloseMenuIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-100 ${
          mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-gray-700 no-underline py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {link.label}
            </a>
          ))}

          <div className="border-t border-gray-100 my-2" />

          {isLoading ? (
            <div className="w-full h-10 bg-gray-100 rounded-lg animate-pulse" />
          ) : isAuthenticated && user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-[15px] font-medium text-gray-700 no-underline py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                  {user.username.charAt(0)}
                </div>
                {user.username}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-[15px] font-medium text-red-600 py-3 px-3 rounded-lg hover:bg-red-50 transition-colors bg-transparent border-none cursor-pointer text-left w-full"
              >
                <LogoutIcon />
                Sign out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-1">
              <a
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-lg border-none text-[14px] font-semibold cursor-pointer text-center no-underline transition-all duration-200"
              >
                Masuk
              </a>
              <a
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-white border border-gray-200 text-blue-600 px-4 py-2.5 rounded-lg text-[14px] font-semibold cursor-pointer text-center no-underline transition-all duration-200"
              >
                Daftar
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
