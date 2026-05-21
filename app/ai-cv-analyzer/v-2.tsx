"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Icon Components ─── */
function CloudUploadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}

function DocumentInputIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M12 18v-6" />
      <path d="m9 15 3-3 3 3" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#FBBF24" : "none"} stroke="#FBBF24" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ChevronDownIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L14.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

/* ─── Data ─── */
const reviews: Review[] = [
  {
    name: "Workshees(@worksheess)",
    role: "Komunitas Karir",
    text: "gw kira CV gw udah bagus, ternyata masih banyak yang kurang ini guru, gara-gara fitur ini, jadi tau kursor CV harus ada kata kunci yang relevan sesuai posisi 😱",
    avatar: "W",
    avatarBg: "#7C3AED",
  },
  {
    name: "Rio (@riocaronekso)",
    role: "Career Development Content Creator",
    text: "Step 1 dapet kerja: Improve & isi notice HRD, upeole CV lo disini. Analisis lengkap & action-item -nya super detail.",
    avatar: "R",
    avatarBg: "#2563EB",
  },
  {
    name: "Andre Saras (@andrebrn_)",
    role: "Content Creator",
    text: "jujur ni ngabahat banget ini in i buat obsesivers. Langsung kelarin masih yang harus gua benerin & benefit. Ok daji approved.",
    avatar: "A",
    avatarBg: "#059669",
  },
  {
    name: "Putri (@chocostudy_)",
    role: "Undergraduate Student",
    text: "Bru ket menjpa gw kusto beberapa past internship yobbish masih kuioh connectos 5 sst",
    avatar: "P",
    avatarBg: "#DC2626",
  },
  {
    name: "Theresa Naesya (@minanotolaep)",
    role: "Fresh graduate",
    text: "bagus analytica, lo ternyata fitursnya bentar bantai bangat buat karir lojeyword mana yang harus di highlight di CV.",
    avatar: "T",
    avatarBg: "#7C3AED",
  },
  {
    name: "Karinaspacc(@karinaspacc)",
    role: "Media & Komunitas Karir",
    text: "Buat yg sering cari kerja, plis belihin CV di bisakerja. Fiake CV Reviewer di Cosin dsini bagian s - 2 & poin perbaikannya lengkap.",
    avatar: "K",
    avatarBg: "#0891B2",
  },
  {
    name: "Nana (@narasdiyaa)",
    role: "Content Creator Karir",
    text: "Soual cangugdi buat free!ngokl Gak sampe 1 meni udpat semui perbailain CV luar oleh di notice HR & bonus personalitystes!",
    avatar: "N",
    avatarBg: "#D97706",
  },
  {
    name: "Imam Vishal (@imampron_)",
    role: "Undergraduate Student",
    text: "bijut banok ai fitur yg bikin CV kelihin merarik dimata HR. Penting bgt buat mahsiswa untuk di review secara detall gini.",
    avatar: "I",
    avatarBg: "#2563EB",
  },
  {
    name: "Indriwan Sadewa (@indrisaaewien_)",
    role: "Undergraduate Student",
    text: "Frui ni bercar karitna jupe benerin CV Non-ATS jadi format ATS & ubah bahasa non-formal jadi lebih professional.",
    avatar: "I",
    avatarBg: "#059669",
  },
  {
    name: "Gerald Rombeldayk (@ger_obaldsoed)",
    role: "Legal Consultant",
    text: "bang ngshsin biut update CV non badisya se in-degtn huf 🙃 neifbit buat gw mang baca tips 2 di internet 🥺",
    avatar: "G",
    avatarBg: "#DC2626",
  },
  {
    name: "Jessica F. (@bizeemeglizer_)",
    role: "Legal Consultant",
    text: "Thanks to this tool. CV aku jadi lebih clean dan eye-catching. Recommended banget buat yang lagi jadi hunting!",
    avatar: "J",
    avatarBg: "#7C3AED",
  },
  {
    name: "Eza Hazami ★",
    role: "Tech HR Business Partner",
    text: "tangun suka nayahatin diri sendiri! kalo ga dipanggil HRD, bisa jadi ga faktor human error juga. Better cebaikain tau CV mu ini review dagi bisakerja review-cv nya Deals! Gratis kais mas. Css 🙂",
    avatar: "E",
    avatarBg: "#0891B2",
  },
];

interface Review {
  name: string;
  role: string;
  text: string;
  avatar: string;
  avatarBg: string;
}

const faqItems = [
  {
    question: "Apa itu CV ATS Checker?",
    answer:
      "CV ATS Checker adalah alat yang menganalisis CV kamu untuk memastikan kompatibilitas dengan Applicant Tracking System (ATS) — software yang digunakan perusahaan untuk menyaring lamaran kerja secara otomatis. Alat ini memeriksa format, kata kunci, dan struktur CV agar peluang kamu lolos screening awal lebih besar.",
  },
  {
    question: "Bagaimana cara optimasi CV agar ATS friendly?",
    answer:
      "Gunakan format yang sederhana tanpa tabel atau kolom, pilih font standar, sertakan kata kunci yang relevan dari deskripsi pekerjaan, dan gunakan heading yang jelas seperti 'Pengalaman Kerja' dan 'Pendidikan'. Hindari penggunaan gambar, ikon, atau grafik yang tidak bisa dibaca ATS.",
  },
  {
    question: "Bagaimana mengetahui bahasa CV sudah sesuai dengan pekerjaan yang dilamar?",
    answer:
      "Bandingkan kata kunci dan terminologi di CV kamu dengan yang ada di job description. AI CV Analyzer kami akan menganalisis kesesuaian bahasa dan memberikan rekomendasi kata kunci yang perlu ditambahkan agar CV kamu lebih relevan dengan posisi yang dilamar.",
  },
  {
    question: "Format CV apa yang bagus untuk ATS?",
    answer:
      "Format terbaik untuk ATS adalah PDF atau DOCX dengan layout satu kolom, tanpa header/footer, tanpa tabel kompleks, dan menggunakan font standar seperti Arial, Calibri, atau Times New Roman. Pastikan ukuran file tidak lebih dari 5MB.",
  },
  {
    question: "Berapa skor ATS yang bagus untuk CV?",
    answer:
      "Skor ATS yang baik umumnya di atas 75%. Skor di atas 85% dianggap sangat baik dan meningkatkan peluang CV kamu untuk lolos tahap screening otomatis. Namun, skor ini hanyalah panduan — isi dan relevansi CV dengan posisi yang dilamar tetap menjadi faktor utama.",
  },
];

/* ─── Sub-Components ─── */

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3 relative transition-all duration-200 hover:shadow-md group">
      {/* Close/Dismiss Icon */}
      <button className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 transition-colors bg-transparent border-none cursor-pointer p-0.5">
        <CloseIcon />
      </button>
      {/* Author */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ background: review.avatarBg }}
        >
          {review.avatar}
        </div>
        <div>
          <p className="text-[13px] font-semibold text-gray-900 m-0 leading-tight">{review.name}</p>
          <p className="text-[11px] text-gray-500 m-0">{review.role}</p>
        </div>
      </div>
      {/* Body */}
      <p className="text-[12px] text-gray-600 m-0 leading-relaxed line-clamp-4">{review.text}</p>
    </div>
  );
}

function FAQItem({ item, isOpen, onToggle }: { item: (typeof faqItems)[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 bg-white">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 bg-white border-none cursor-pointer text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-[14px] font-semibold text-gray-800">{item.question}</span>
        <ChevronDownIcon
          size={18}
          className={`text-gray-400 transition-transform duration-300 shrink-0 ml-4 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? "300px" : "0px", opacity: isOpen ? 1 : 0 }}
      >
        <div className="px-6 pb-4">
          <p className="text-[13px] text-gray-600 m-0 leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function AICVAnalyzer() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" style={{ colorScheme: "light" }}>
      <Navbar />

      {/* ─── Hero Section ─── */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-400 py-10 px-8 text-center">
        <h1 className="text-[22px] md:text-[26px] font-bold text-white leading-relaxed max-w-[1240px] mx-auto">
          Tingkatkan Peluang Lolos Screening CV ATS Sebesar 73%{" "}
          <span className="inline-block ">🚀</span>
        </h1>
      </section>

      {/* ─── Upload Card ─── */}
      <section className="max-w-[540px] mx-auto px-6 -mt-6 relative z-10 w-full">
        <div className="bg-white rounded-2xl shadow-[0_4px_32px_rgba(37,99,235,0.10)] px-7 pt-7 pb-7 border border-gray-100">

          {/* ── Document Input ── */}
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <DocumentInputIcon />
            </div>
            <h2 className="text-[16px] font-bold text-gray-900 m-0">Document Input</h2>
          </div>

          {/* Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 mb-4 ${
              isDragging
                ? "border-blue-500 bg-blue-50/60"
                : "border-gray-200 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/30"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <CloudUploadIcon />
            </div>
            <p className="text-[14px] font-semibold text-gray-700 m-0">Click to upload or drag &amp; drop</p>
            <p className="text-[12px] text-gray-400 m-0">PDF, DOCX, or TXT (Max 5MB)</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Uploaded File */}
          {uploadedFile && (
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <FileIcon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-800 m-0 truncate">{uploadedFile.name}</p>
                <p className="text-[11px] text-gray-400 m-0">{uploadedFile.size} • Uploaded just now</p>
              </div>
              <button
                onClick={removeFile}
                className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors shrink-0"
              >
                <TrashIcon />
              </button>
            </div>
          )}

          {/* ── Divider ── */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* ── Target Role Context ── */}
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <TargetIcon />
            </div>
            <h2 className="text-[16px] font-bold text-gray-900 m-0">Target Role Context</h2>
          </div>

          {/* Saved Job Dropdown */}
          <label className="text-[13px] font-medium text-gray-600 mb-2 block">Compare against saved job</label>
          <div className="relative mb-4">
            <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-700 font-medium cursor-pointer outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all pr-10">
              <option>Senior Product Designer @ TechFlow</option>
              <option>Frontend Developer @ Tokopedia</option>
              <option>UX Researcher @ Gojek</option>
            </select>
            <ChevronDownIcon size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* OR Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wide">OR</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Paste Job Description */}
          <label className="text-[15px] font-bold text-gray-900 mb-2 block">Paste Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] text-gray-700 resize-none outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all mb-6"
          />

          {/* Submit Button */}
          <button className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-blue-600 text-white text-[15px] font-semibold border-none cursor-pointer hover:bg-blue-700 transition-all duration-200 shadow-[0_4px_16px_rgba(37,99,235,0.25)]">
            <SparkleIcon />
            Analyze Match
          </button>
        </div>
      </section>

      {/* ─── Reviews Section ─── */}
      <section className="py-14 px-6 bg-gray-50">
        {/* Rating Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <StarIcon />
          <span className="text-[20px] md:text-[22px] font-bold text-gray-900">
            4.9/5 • Review dari 1.035 Pengguna
          </span>
        </div>

        {/* Review Grid */}
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="py-14 px-6 bg-white">
        <h2 className="text-[20px] md:text-[24px] font-bold text-gray-900 text-center mb-8">
          Semua yang Perlu Kamu Ketahui Tentang CV ATS
        </h2>

        <div className="max-w-[720px] mx-auto flex flex-col gap-3">
          {faqItems.map((item, i) => (
            <FAQItem
              key={item.question}
              item={item}
              isOpen={openFAQ === i}
              onToggle={() => setOpenFAQ(openFAQ === i ? null : i)}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
