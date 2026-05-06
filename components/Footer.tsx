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
    <footer className="border-t border-gray-200 px-8 py-6 flex items-center justify-between bg-white mt-auto">
              <Image
        src={logo}
        alt="Logo"
        width={150}
        height={150}
        />  
      <div className="flex items-center gap-6">
        {footerLinks.map((link) => (
          <a
            key={link}
            href="#"
            className="text-[13px] text-gray-500 no-underline hover:text-gray-700 transition-colors"
          >
            {link}
          </a>
        ))}
      </div>
      <span className="text-xs text-gray-400">
        © 2024 LokerHub. Powered by Swiss-precision design.
      </span>
    </footer>
  );
}
