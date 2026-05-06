"use client";
import Image from "next/image";
import logo from "../public/assets/logo.svg"

const navLinks = ["Loker", "Mentoring", "AI CV Analyzer"];

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 h-[60px] bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Image
        src={logo}
        alt="Logo"
        width={150}
        height={150}
        />  
        <div className="flex items-center gap-6">
          {navLinks.map((link, i) => (
            <a
              key={link}
              href="#"
              className={`text-sm font-medium no-underline transition-colors duration-200 ${
                i === 0
                  ? "text-blue-600"
                  : "text-gray-600 border-b-2 border-transparent hover:text-blue-600"
              }`}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
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
      </div>
    </nav>
  );
}
