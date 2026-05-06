"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard, { type JobCardData } from "@/components/JobCard";

/* ─── Icon Components ─── */
function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ChevronDownIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ─── Data ─── */
const filterTags = ["Level", "Jenis", "Tipe", "Fasilitas", "Lokasi", "Gaji", "Metode"];

const categories = [
  "Semua Pekerjaan",
  "Admin & 3 ps",
  "Ads & Digital Marketing",
  "Architecture & Design",
  "Art, Media & Communications",
  "Business, Sales & Commercial",
  "Customer Service",
  "Data & Analytics",
  "Education",
];

const jobCards: JobCardData[] = [
  {
    id: 1,
    title: "Marketing Technology",
    company: "PFI Mega Life",
    verified: true,
    type: "Kontrak",
    typeColor: "#3B82F6",
    location: "On-site • Jakarta Selatan",
    experience: "Min. 1-3 Years Experience",
    salary: "Negotiable",
    logoColor: "#1E40AF",
    logoText: "PFI",
    logoBg: "#E0E7FF",
    activeTime: "Rekruter aktif 1h lalu",
  },
  {
    id: 2,
    title: "Sales Counter - PIK",
    company: "Allure Industries",
    verified: true,
    type: "Kontrak",
    typeColor: "#3B82F6",
    location: "On-site • Jakarta Utara",
    experience: "Min. SMA/K",
    salary: "Negotiable",
    logoColor: "#065F46",
    logoText: "AI",
    logoBg: "#D1FAE5",
    activeTime: "Rekruter aktif 1h lalu",
  },
  {
    id: 3,
    title: "Security Operations Lead",
    company: "Dropsuite",
    verified: false,
    type: "Penuh waktu",
    typeColor: "#16A34A",
    location: "On-site • Bandung",
    experience: "Min. 5+ Years Experience",
    salary: "Negotiable",
    logoColor: "#2563EB",
    logoText: "DS",
    logoBg: "#DBEAFE",
    activeTime: "Rekruter aktif 1h lalu",
  },
  {
    id: 4,
    title: "Sales Consultant",
    company: "Arysun Energy Group",
    verified: true,
    type: "Penuh waktu",
    typeColor: "#16A34A",
    location: "Hybrid • Jakarta Selatan",
    experience: "Min. 3-5 Years Experience",
    salary: "Rp7.000.000 - 9.000.000",
    logoColor: "#DC2626",
    logoText: "AE",
    logoBg: "#FEE2E2",
    activeTime: "Rekruter aktif 2h lalu",
  },
  {
    id: 5,
    title: "Management Trainee",
    company: "PT Adhimix Precast Indonesia",
    verified: false,
    type: "Penuh waktu",
    typeColor: "#16A34A",
    location: "On-site • Jakarta",
    experience: "Min. Fresh Grad",
    salary: "Negotiable",
    logoColor: "#7C3AED",
    logoText: "AP",
    logoBg: "#EDE9FE",
    activeTime: "Rekruter aktif 1h lalu",
  },
  {
    id: 6,
    title: "HRD Staff",
    company: "PT Adhimix Precast Indonesia",
    verified: false,
    type: "Penuh waktu",
    typeColor: "#16A34A",
    location: "On-site • Jakarta",
    experience: "Min. 1-3 Years Experience",
    salary: "Negotiable",
    logoColor: "#7C3AED",
    logoText: "AP",
    logoBg: "#EDE9FE",
    activeTime: "Rekruter aktif 1h lalu",
  },
];

/* ─── Main Page ─── */
export default function Home() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" style={{ colorScheme: "light" }}>
      <Navbar />

      {/* ─── Hero Section ─── */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 py-14 px-8 text-center">
        <h1 className="text-[28px] font-bold text-white leading-relaxed max-w-[1240px] mx-auto">
          Cari Lowongan Kerja Pakai BisaKerja{" "}
          <span className="text-yellow-300">#LebihPasti</span>
        </h1>
      </section>

      {/* ─── Search & Filters Section ─── */}
      <section className="max-w-[1240px] mx-auto px-6 -mt-9 relative z-10 w-full">
        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] px-7 pt-6 pb-5">
          {/* Search Bar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 flex items-center border border-gray-200 rounded-[10px] px-3.5 h-11 bg-white">
              <input
                type="text"
                placeholder="Search by job title, company, & skills"
                className="flex-1 border-none outline-none text-sm text-gray-900 bg-transparent placeholder:text-gray-400"
              />
              <button className="w-9 h-9 rounded-lg bg-blue-600 border-none cursor-pointer flex items-center justify-center text-white shrink-0 hover:bg-blue-700 transition-colors">
                <SearchIcon />
              </button>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-[13px] font-medium cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  {tag}
                  <ChevronDownIcon size={12} />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 shrink-0 text-gray-500">
              <span className="text-[13px]">Paling relevan</span>
              <ChevronDownIcon size={12} />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1">
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(i)}
              className={`px-4 py-2 rounded-full border-none text-[13px] font-medium cursor-pointer whitespace-nowrap transition-all duration-200 ${
                activeCategory === i
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Job Cards Grid ─── */}
      <section className="max-w-[1240px] mx-auto px-6 pt-7 pb-12 w-full">
        <div className="grid grid-cols-4 gap-4 w-full">
          {jobCards.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
