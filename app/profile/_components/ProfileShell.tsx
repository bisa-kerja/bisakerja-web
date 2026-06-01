"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth";
import {
  BookmarkIcon,
  ChartLineIcon,
  FileTextIcon,
  HelpCircleIcon,
  LogOutIcon,
  UserIcon,
} from "./ProfileIcons";

type ProfileSection = "profile" | "applications" | "saved-jobs" | "cv-history";

interface ProfileShellProps {
  activeSection: ProfileSection;
  title: string;
  description: string;
  children: ReactNode;
}

export function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function ProfileShell({
  activeSection,
  title,
  description,
  children,
}: ProfileShellProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navItems = [
    {
      key: "profile",
      href: "/profile",
      label: "Profile Settings",
      icon: <UserIcon className="w-5 h-5" />,
    },
    {
      key: "applications",
      href: "/profile/application-tracker",
      label: "My Applications",
      icon: <FileTextIcon className="w-5 h-5" />,
    },
    {
      key: "saved-jobs",
      href: "/profile/saved-jobs",
      label: "Saved Jobs",
      icon: <BookmarkIcon className="w-5 h-5" />,
    },
    {
      key: "cv-history",
      href: "/profile/cv-analyze-history",
      label: "CV Analyze History",
      icon: <ChartLineIcon className="w-5 h-5" />,
    },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="flex flex-1 border-t border-gray-100">
        <aside className="w-64 flex-shrink-0 bg-[#F9FAFB] border-r border-gray-100 flex-col hidden lg:flex">
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.key;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-[14px] ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 space-y-4">
            <div className="space-y-1">
              <Link
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium text-[14px]"
              >
                <HelpCircleIcon className="w-5 h-5" />
                Help Center
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium text-[14px]"
              >
                <LogOutIcon className="w-5 h-5" />
                Log out
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-[#F4F5F7] p-4 sm:p-6 md:p-8 lg:p-10 pb-16">
          {/* Mobile nav tabs (visible when sidebar is hidden) */}
          <div className="lg:hidden flex items-center gap-1 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.key;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-[13px] whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="max-w-5xl mx-auto">
            <header className="mb-8">
              <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">
                {title}
              </h1>
              <p className="text-gray-500 mt-2 text-[15px]">{description}</p>
            </header>

            {children}

            <footer className="mt-12 flex flex-col md:flex-row items-center justify-between text-[13px] text-gray-400 gap-4">
              <p>© 2024 Bisakerja. Temukan karier impianmu.</p>
              <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
                <a href="#" className="hover:text-gray-600 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-gray-600 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-gray-600 transition-colors">
                  Cookie Policy
                </a>
                <a href="#" className="hover:text-gray-600 transition-colors">
                  Accessibility
                </a>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
