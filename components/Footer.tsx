import Image from "next/image";
import logo from "../public/assets/logo.svg"

const footerLinks = [
  "About Us",
  "Contact",
  "Help Center",
  "Privacy Policy",
  "Terms of Service",
  "Careers",
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-white mt-auto">
      <Image
        src={logo}
        alt="Logo"
        width={120}
        height={120}
        className="md:w-[150px]"
      />  
      <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center">
        {footerLinks.map((link) => (
          <a
            key={link}
            href="#"
            className="text-[12px] md:text-[13px] text-gray-500 no-underline hover:text-gray-700 transition-colors"
          >
            {link}
          </a>
        ))}
      </div>
      <span className="text-xs text-gray-400 text-center">
        © 2026 BisaKerja. Powered by DBS Coding Camp Foundation.
      </span>
    </footer>
  );
}

