"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "motion/react";
import {
  APIError,
  CV_ANALYZER_RESULT_STORAGE_KEY,
  analyzeCV,
  fetchActiveCVFile,
} from "@/lib/api";

/* ─── Icon Components ─── */

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function CloudUploadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
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

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="white" />
      <path d="M8 12l2.5 2.5L16 9" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpinnerIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={`cv-spinner ${className}`} width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#BFDBFE" strokeWidth="2.5" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function EmptyCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#D1D5DB" strokeWidth="2" />
    </svg>
  );
}

/* ─── Loading Steps ─── */
const loadingSteps = [
  "Parsing your CV...",
  "Identifying core sections...",
  "Analyzing your overall CV...",
  "Checking your professional background...",
  "Identifying your achievements...",
  "Formulating useful recommendation...",
];

/* ─── Loading Overlay Component ─── */
function LoadingOverlay({ currentStep }: { currentStep: number }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(239, 246, 255, 0.92)", backdropFilter: "blur(8px)" }}
    >
      <div className="flex flex-col items-center gap-4 w-full max-w-[540px] px-6">
        {loadingSteps.map((step, i) => {
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;
          const isPending = i > currentStep;

          return (
            <div
              key={step}
              className="cv-step-animate"
              style={{
                animationDelay: `${i * 80}ms`,
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                className="flex items-center gap-3 rounded-full px-6 py-3.5 transition-all duration-500"
                style={{
                  minWidth: isPending ? "240px" : isActive ? "280px" : "300px",
                  maxWidth: "100%",
                  background: isCompleted
                    ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)"
                    : isActive
                    ? "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)"
                    : "#F3F4F6",
                  border: isActive ? "1px solid rgba(37, 99, 235, 0.2)" : "1px solid transparent",
                }}
              >
                {isCompleted && <CheckCircleIcon />}
                {isActive && <SpinnerIcon className="animate-spin" />}
                {isPending && <EmptyCircleIcon />}
                <span
                  className="text-[15px] font-semibold"
                  style={{
                    color: isCompleted ? "white" : isActive ? "#2563EB" : "#9CA3AF",
                  }}
                >
                  {step}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Data ─── */
const suggestedRoles = ["Software Engineer", "Product Manager", "Data Analyst", "UI/UX Designer"];


const testimonials = [
  {
    text: "The analysis is extremely clear. I immediately knew which parts of my experience needed improvement to better align with my target role.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    name: "Nadya Prameswari",
    role: "Fresh Graduate",
  },
  {
    text: "Usually, I'm confused about where to start revising my CV. Here, the recommendations are specific, ranging from keywords and structure to weak phrasing.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    name: "Rizky Aditya",
    role: "Software Engineer",
  },
  {
    text: "This feature helped me tailor my CV for product analyst openings. After the revision, my CV felt much more organized and focused.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    name: "Aulia Rahman",
    role: "Product Analyst",
  },
  {
    text: "The most useful part for me was the ATS keyword insights. I was able to write about my skills and experience using much more relevant terminology.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
    name: "Dimas Saputra",
    role: "Data Analyst",
  },
  {
    text: "The process is fast, yet highly detailed. It is perfect for checking your CV before submitting an application so you don't just rely on guesswork.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
    name: "Karina Salsabila",
    role: "Marketing Associate",
  },
  {
    text: "I love that the recommendations are actionable. It's not just a score, but there is clear guidance on which parts need rewriting.",
    image: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&w=120&q=80",
    name: "Bagus Pratama",
    role: "UI/UX Designer",
  },
  {
    text: "Very helpful for career switchers. My CV does a much better job highlighting transferable skills and the most relevant experience now.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
    name: "Maya Kartika",
    role: "Business Analyst",
  },
  {
    text: "After using this analyzer, I finally understand why my previous CV was barely readable by ATS. The next revision will be much more targeted.",
    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80",
    name: "Fajar Nugroho",
    role: "Operations Specialist",
  },
  {
    text: "As a mentor, I often recommend this to my mentees because the output is practical and very easy for beginners to understand.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    name: "Intan Lestari",
    role: "Career Mentor",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const faqItems = [
  {
    question: "What is a CV ATS Checker?",
    answer:
      "A CV ATS Checker is a tool that analyzes your CV to ensure compatibility with Applicant Tracking Systems (ATS) — software used by companies to screen job applications automatically. This tool checks the format, keywords, and structure of your CV to increase your chances of passing the initial screening.",
  },
  {
    question: "How do I optimize my CV to be ATS-friendly?",
    answer:
      "Use a simple format without tables or columns, choose standard fonts, include relevant keywords from the job description, and use clear headings like 'Work Experience' and 'Education'. Avoid using images, icons, or graphics that cannot be read by an ATS.",
  },
  {
    question: "How do I know if my CV's language matches the job I'm applying for?",
    answer:
      "Compare the keywords and terminology in your CV with those in the job description. Our AI CV Analyzer will analyze the language match and provide keyword recommendations to add, making your CV more relevant to the target position.",
  },
  {
    question: "What CV format is best for ATS?",
    answer:
      "The best format for ATS is PDF or DOCX with a single-column layout, no headers/footers, no complex tables, and using standard fonts like Arial, Calibri, or Times New Roman. Make sure the file size does not exceed 5MB.",
  },
  {
    question: "What is a good ATS score for a CV?",
    answer:
      "A good ATS score is generally above 75%. A score above 85% is considered excellent and significantly increases your chances of passing automated screening. However, this score is only a guide — the actual content and relevance of your CV to the position remain the key factors.",
  },
];

/* ─── Sub-Components ─── */

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
  const router = useRouter();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ file: File; name: string; size: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [roleSearch, setRoleSearch] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ─── Analysis Loading Simulation ─── */
  useEffect(() => {
    if (!isAnalyzing) return;

    const timeout = setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, loadingSteps.length - 1));
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isAnalyzing, currentStep]);

  const handleAnalyze = useCallback(async () => {
    if (!uploadedFile || targetRoles.length === 0 || isAnalyzing) return;

    setAnalysisError(null);
    setCurrentStep(0);
    setIsAnalyzing(true);

    try {
      let cvFileId: string | null = null;

      try {
        const activeCVResponse = await fetchActiveCVFile();
        cvFileId = activeCVResponse.data?.cvFile?.id ?? null;
      } catch (error) {
        if (error instanceof APIError && error.status === 401) {
          throw error;
        }
      }

      const response = await analyzeCV({
        jobRoles: targetRoles,
        cvFile: uploadedFile.file,
        cvFileId,
        language: "id",
      });

      sessionStorage.setItem(
        CV_ANALYZER_RESULT_STORAGE_KEY,
        JSON.stringify(response),
      );

      setCurrentStep(loadingSteps.length);
      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentStep(0);
        router.push("/ai-cv-analyzer/result");
      }, 700);
    } catch (error) {
      setIsAnalyzing(false);
      setCurrentStep(0);

      if (error instanceof APIError && error.status === 401) {
        router.push("/login");
        return;
      }

      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Gagal menganalisis CV. Silakan coba lagi.",
      );
    }
  }, [isAnalyzing, router, targetRoles, uploadedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({
        file,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
      setAnalysisError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile({
        file,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
      setAnalysisError(null);
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
    setAnalysisError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeRole = (role: string) => {
    setTargetRoles(targetRoles.filter((r) => r !== role));
  };

  const addRole = (role: string) => {
    if (!targetRoles.includes(role)) {
      setTargetRoles([...targetRoles, role]);
    }
  };

  const handleRoleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && roleSearch.trim()) {
      e.preventDefault();
      addRole(roleSearch.trim());
      setRoleSearch("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {isAnalyzing && <LoadingOverlay currentStep={currentStep} />}
      <Navbar />

      {/* ─── Hero Section ─── */}
      <section className="relative isolate overflow-hidden px-6 pb-20 pt-28" style={{ background: "linear-gradient(135deg, #1e40af 0%, #2563eb 35%, #3b82f6 65%, #60a5fa 100%)" }}>
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-5" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
        </div>
        <div className="relative max-w-[900px] mx-auto flex items-center justify-between gap-8">
          <div className="flex-1 text-left">
            <h1 className="text-[28px] md:text-[34px] font-bold text-white leading-relaxed">
              Increase Your Chances of Passing<br/>
              <span className="text-yellow-300">CV ATS Screening by 73%</span>
            </h1>
            <p className="mt-3 text-blue-100 text-base md:text-lg max-w-xl leading-relaxed">
              Analyze your CV with AI and get specific recommendations to increase your chances of passing ATS screening.
            </p>
          </div>
          <div className="block max-[891px]:hidden shrink-0 absolute -bottom-36 -right-24">
            <Image
              src="/maskots/statistics.png"
              alt="BisaKerja Statistics Mascot"
              width={420}
              height={420}
              priority
              className="drop-shadow-2xl"
              style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.2))" }}
            />
          </div>
        </div>
      </section>

      {/* ─── Upload Card ─── */}
      <section className="max-w-[900px] mx-auto -mt-12 relative z-10 w-full bg-white rounded-xl px-4 md:px-0">
        <div className="bg-white rounded-2xl shadow-md px-4 md:px-7 pt-5 md:pt-6 pb-5 md:pb-6 border border-blue-50">
             {/* ── Document Input ── */}
          <label className="text-[13px] font-semibold text-gray-800 mb-2 block">
              Upload Your CV <span className="text-red-500">*</span>
            </label>

          {/* Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl px-8 py-12 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 mb-4 ${
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


          {/* Target Roles */}
          <div className="mb-6">
            <label className="text-[13px] font-semibold text-gray-800 mb-2 block">
              Target Roles <span className="text-red-500">*</span>
            </label>

            {/* Search Input */}
            <div className="relative flex items-center mb-3">
              <span className="absolute left-3.5 text-gray-400">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search roles (e.g., Product Designer, Data Analyst)"
                className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-lg text-[13px] text-gray-900 bg-white outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10 transition-all duration-200"
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
                onKeyDown={handleRoleKeyDown}
              />
            </div>

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {targetRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 text-white text-[12px] font-medium"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => removeRole(role)}
                    className="flex items-center justify-center bg-transparent border-none cursor-pointer text-white/80 hover:text-white transition-colors p-0"
                    aria-label={`Remove ${role}`}
                  >
                    <CloseIcon />
                  </button>
                </span>
              ))}
            </div>

            {/* Suggested */}
            <p className="text-[11px] font-semibold text-gray-400 tracking-wide uppercase mb-2">
              Suggested for you
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedRoles
                .filter((r) => !targetRoles.includes(r))
                .map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => addRole(role)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-[12px] text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer font-medium"
                  >
                    + {role}
                  </button>
                ))}
            </div>
          </div>

          {/* Submit Button */}
          {analysisError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
              {analysisError}
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button
              onClick={handleAnalyze}
              disabled={!uploadedFile || targetRoles.length === 0 || isAnalyzing}
              className={`flex items-center gap-2 px-8 py-3 rounded-full text-white text-[14px] font-semibold border-none cursor-pointer transition-all duration-200 shadow-[0_4px_16px_rgba(37,99,235,0.25)] ${
                !uploadedFile || targetRoles.length === 0
                  ? "bg-gray-300 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
              }`}
            >
              Review Now
            </button>
          </div>
        </div>
      </section>

          {/* ─── FAQ Section ─── */}
      <section className="py-14 px-6 bg-white">
        <h2 className="text-[20px] md:text-[24px] font-bold text-gray-900 text-center mb-8">
          Everything You Need to Know About CV ATS
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

      {/* ─── Testimonials Section ─── */}
      <section className="bg-white py-14 px-6 relative">
        <div className="container z-10 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center max-w-[540px] mx-auto text-center"
          >

            <h2 className="text-[22px] sm:text-[26px] md:text-[32px] font-bold tracking-tight mt-5 text-gray-900">
              What BisaKerja Users Are Saying
            </h2>
            <p className="text-center mt-4 text-[14px] text-gray-600 leading-relaxed">
              Stories from users who successfully made their CVs neater, more relevant, and ready to pass ATS screening.
            </p>
          </motion.div>

          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
          </div>
        </div>
      </section>



      <Footer />
    </div>
  );
}
