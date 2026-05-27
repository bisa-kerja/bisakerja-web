"use client";

import { useEffect, useState } from "react";
import JobCard, { type JobCardProps } from "./JobCard";

/* ─── Icon Components ─── */
function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-300 ease-in-out ${open ? "rotate-180" : "rotate-0"}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L14.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill="#F59E0B"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="cv-spinner" width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#BFDBFE" strokeWidth="2.5" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Mock Data ─── */
const overallImpression = `Overall, your CV leaves an exceptionally strong impression. It is well-structured, highly engaging, and immediately captures attention with its clear presentation of technical skills and quantifiable achievements. The depth of your work experience, coupled with impressive competition wins and a clear professional summary, makes this a standout resume. It effectively communicates your expertise as a Front End Developer and your passion for the field.`;

const sections = [
  {
    title: "Contact Information",

    analysis: `Your contact information is exceptionally complete and well-presented. You've included your full name, phone number, email address, LinkedIn profile, GitHub, and even a personal portfolio link. This provides recruiters with multiple avenues to connect with you and review your work, which is highly beneficial.`,
    actionPoints: [
      "Ensure all links, especially your GitHub and portfolio, are active and showcase your best and most recent projects. A broken link can be a missed opportunity.",
      "While your email is functional, consider using a more professional email address that aligns with your name, such as 'agil.saputra@email.com', if 'ragelyusuf752@gmail.com' is not your primary professional one.",
    ],
    importance: `Complete and accurate contact information is paramount as it's the primary way recruiters will reach out to you. Including professional links like LinkedIn, GitHub, and a portfolio demonstrates your commitment to your craft and provides immediate access to your professional network and coding samples, significantly enhancing your credibility and visibility.`,
  },
  {
    title: "Relevant Skills",
    analysis: `Your skills section is comprehensive and well-organized, covering a wide range of relevant front-end technologies and tools. The inclusion of both technical skills and soft skills provides a balanced view of your capabilities.`,
    actionPoints: [
      "Consider grouping skills by category (e.g., Languages, Frameworks, Tools) for better readability.",
      "Add proficiency levels to key skills to give recruiters a clearer picture of your expertise.",
    ],
    importance: `A well-curated skills section helps ATS systems match your profile with job requirements and gives hiring managers a quick overview of your technical capabilities.`,
  },
  {
    title: "Professional Summary",
    analysis: `Your professional summary provides a good overview but could be more targeted. It mentions your experience but lacks specific metrics and achievements that would make it more impactful.`,
    actionPoints: [
      "Add quantifiable achievements to your summary (e.g., 'improved page load times by 40%').",
      "Tailor the summary to explicitly mention B2B SaaS experience as required by the Target Role.",
    ],
    importance: `The professional summary is often the first section recruiters read. A compelling, targeted summary can significantly increase the chances of your CV being shortlisted.`,
  },
  {
    title: "Work Experience",
    analysis: `Your work experience section is detailed and well-structured with clear descriptions of responsibilities and achievements at each role.`,
    actionPoints: [
      "Ensure all dates use the same format (e.g., MM/YYYY - MM/YYYY) for consistency.",
      "Lead each bullet point with a strong action verb to make your contributions more impactful.",
    ],
    importance: `Work experience is the most critical section of your CV. It demonstrates your practical skills and career progression to potential employers.`,
  },
];

const keywordData = {
  missing: ["Figma Auto-layout", "A/B Testing", "Design Systems"],
  present: ["User Research", "Wireframing", "Prototyping"],
};

/* ─── Mock Matched Jobs ─── */
const matchedJobs: JobCardProps[] = [
  {
    id: "match-1",
    title: "Frontend Developer",
    company: { name: "Tokopedia", logoUrl: null },
    workType: "HYBRID",
    employmentType: "FULL_TIME",
    experienceLevel: "MID_LEVEL",
    location: { display: "Jakarta, Indonesia" },
    salary: { display: "Rp 8.000.000 – 15.000.000" },
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sourcePlatform: { name: "LinkedIn" },
  },
  {
    id: "match-2",
    title: "React Developer",
    company: { name: "Gojek", logoUrl: null },
    workType: "ONSITE",
    employmentType: "FULL_TIME",
    experienceLevel: "MID_LEVEL",
    location: { display: "Jakarta, Indonesia" },
    salary: { display: "Rp 10.000.000 – 18.000.000" },
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    sourcePlatform: { name: "Glints" },
  },
  {
    id: "match-3",
    title: "UI Engineer",
    company: { name: "Bukalapak", logoUrl: null },
    workType: "REMOTE",
    employmentType: "FULL_TIME",
    experienceLevel: "MID_LEVEL",
    location: { display: "Remote" },
    salary: { display: "Rp 9.000.000 – 16.000.000" },
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    sourcePlatform: { name: "Kalibrr" },
  },
  {
    id: "match-4",
    title: "Senior Frontend Engineer",
    company: { name: "Traveloka", logoUrl: null },
    workType: "HYBRID",
    employmentType: "FULL_TIME",
    experienceLevel: "SENIOR_LEVEL",
    location: { display: "Jakarta, Indonesia" },
    salary: { display: "Rp 18.000.000 – 28.000.000" },
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    sourcePlatform: { name: "LinkedIn" },
  },
];

const actionableSteps = [
  {
    title: "Strengthen the Professional Summary",
    description:
      "Your current summary is generic. Tailor it to explicitly mention B2B SaaS experience as required by the Target Role.",
  },
  {
    title: "Integrate missing technical skills",
    description:
      "Add 'Design Systems' and 'Figma Auto-layout' to your skills section and mention them in your recent work experience context.",
  },
  {
    title: "Format consistency in work history",
    description:
      "Ensure all dates use the same format (e.g., MM/YYYY - MM/YYYY) to improve ATS parsability score.",
  },
];

const cvTemplates = [
  { id: "template-1", name: "Template 1", path: "/templates/template-1.html", accent: "#1F2937" },
  { id: "template-2", name: "Template 2", path: "/templates/template-2.html", accent: "#2563EB" },
  { id: "template-3", name: "Template 3", path: "/templates/template-3.html", accent: "#0D9488" },
  { id: "template-4", name: "Template 4", path: "/templates/template-4.html", accent: "#2DD4BF" },
  { id: "template-5", name: "Template 5", path: "/templates/template-5.html", accent: "#1E3A5F" },
  { id: "template-6", name: "Template 6", path: "/templates/template-6.html", accent: "#2563EB" },
  { id: "template-7", name: "Template 7", path: "/templates/template-7.html", accent: "#0F766E" },
  { id: "template-8", name: "Template 8", path: "/templates/template-8.html", accent: "#7C3AED" },
  { id: "template-9", name: "Template 9", path: "/templates/template-9.html", accent: "#EA580C" },
  { id: "template-10", name: "Template 10", path: "/templates/template-10.html", accent: "#4B5563" },
  { id: "template-11", name: "Template 11", path: "/templates/template-11.html", accent: "#2563EB" },
  { id: "template-12", name: "Template 12", path: "/templates/template-12.html", accent: "#0D9488" },
  { id: "template-13", name: "Template 13", path: "/templates/template-13.html", accent: "#7C3AED" },
  { id: "template-14", name: "Template 14", path: "/templates/template-14.html", accent: "#DC2626" },
  { id: "template-15", name: "Template 15", path: "/templates/template-15.html", accent: "#0891B2" },
  { id: "template-16", name: "Template 16", path: "/templates/template-16.html", accent: "#334155" },
  { id: "template-17", name: "Template 17", path: "/templates/template-17.html", accent: "#16A34A" },
  { id: "template-18", name: "Template 18", path: "/templates/template-18.html", accent: "#9333EA" },
  { id: "template-19", name: "Template 19", path: "/templates/template-19.html", accent: "#C2410C" },
];

const generationSteps = [
  "Applying selected template...",
  "Rewriting action points into CV bullets...",
  "Optimizing keywords for ATS...",
  "Polishing layout and spacing...",
];

/* ─── Gauge Chart Component ─── */
function GaugeChart({
  score,
  size = 160,
  strokeWidth = 14,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const [animated, setAnimated] = useState(false);
  const radius = (size - strokeWidth) / 2;
  // Half-circle circumference (π * r)
  const halfCircumference = Math.PI * radius;
  const offset = halfCircumference - (score / 100) * halfCircumference;

  // Color based on score
  const color = score >= 80 ? "#0D9488" : score >= 60 ? "#F59E0B" : "#EF4444";

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const viewBoxHeight = size / 2 + strokeWidth;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: viewBoxHeight }}>
        <svg
          width={size}
          height={viewBoxHeight}
          viewBox={`0 0 ${size} ${viewBoxHeight}`}
          className="overflow-visible"
        >
          {/* Background arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Foreground arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={halfCircumference}
            strokeDashoffset={animated ? offset : halfCircumference}
            className="transition-[stroke-dashoffset] duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          />
          {/* Indicator dot at the end of the arc */}
          {animated && (
            <circle
              cx={
                size / 2 +
                radius *
                  Math.cos(Math.PI - (score / 100) * Math.PI)
              }
              cy={
                size / 2 -
                radius *
                  Math.sin(Math.PI - (score / 100) * Math.PI)
              }
              r={strokeWidth / 2 + 3}
              fill={color}
              stroke="#fff"
              strokeWidth={3}
              className={`transition-opacity duration-300 ease-in delay-1000 ${animated ? "opacity-100" : "opacity-0"}`}
            />
          )}
        </svg>
        {/* Score text in the center */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-baseline gap-[1px]"
        >
          <span
            className="text-[36px] font-extrabold text-slate-800 leading-none"
          >
            {score}
          </span>
          <span
            className="text-[18px] font-bold text-slate-800"
          >
            %
          </span>
        </div>
      </div>
      {/* Fit label */}
      <p
        className="text-[14px] font-bold m-0 mt-2 flex items-center gap-1"
        style={{ color: color }}
      >
        your cv is pretty goddd wdipisicing elit. Tempora nam vitae maxime errom, molestiae placeat deleniti in modi quibusdam itaque iure natus?
      </p>
    </div>
  );
}

/* ─── Donut Chart Component ─── */
function DonutChart({
  score,
  size = 150,
  strokeWidth = 12,
  label = "Score",
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}) {
  const [animated, setAnimated] = useState(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Leave a small visual gap at the top (~4% of the circle)
  const gapFraction = 0.04;
  const usableCircumference = circumference * (1 - gapFraction);
  const offset = usableCircumference - (score / 100) * usableCircumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#DBEAFE"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${usableCircumference} ${circumference}`}
          />
          {/* Foreground arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#2563EB"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${usableCircumference} ${circumference}`}
            strokeDashoffset={animated ? offset : usableCircumference}
            className="transition-[stroke-dashoffset] duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          />
        </svg>
        {/* Center text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <span className="text-[32px] font-extrabold text-slate-800 leading-none">
            {score}%
          </span>
          <span className="text-[13px] text-slate-400 font-semibold mt-1">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

function TemplatePreview({ template }: { template: (typeof cvTemplates)[0] }) {
  return (
    <div
      className="border border-gray-200 rounded-[10px] p-2 bg-slate-50 overflow-hidden h-[210px] relative"
    >
      <div
        className="absolute inset-2 opacity-10 rounded-lg"
        style={{ background: template.accent }}
      />
      <iframe
        src={template.path}
        title={`${template.name} preview`}
        className="w-[320%] h-[320%] border-0 scale-[0.3125] origin-top-left pointer-events-none bg-white rounded-lg"
      />
    </div>
  );
}

function TemplatePickerModal({
  onClose,
  onChoose,
}: {
  onClose: () => void;
  onChoose: (template: (typeof cvTemplates)[0]) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] bg-slate-900/45 backdrop-blur-[6px] flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-picker-title"
    >
      <div
        className="w-[min(1120px,100%)] max-h-[calc(100vh-40px)] overflow-y-auto bg-white rounded-[18px] border border-gray-200 shadow-[0_24px_80px_rgba(15,23,42,0.24)] p-6"
      >
        <div
          className="flex items-start justify-between gap-4 mb-5"
        >
          <div>
            <p
              className="text-[11px] font-extrabold tracking-[1px] uppercase text-blue-600 m-0 mb-1.5"
            >
              Optimized CV Template
            </p>
            <h2
              id="template-picker-title"
              className="text-[22px] font-extrabold text-slate-800 m-0"
            >
              Pilih template CV kamu
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close template picker"
            className="w-9 h-9 rounded-[10px] border border-gray-200 bg-white text-slate-500 cursor-pointer text-[20px] leading-none"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cvTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => onChoose(template)}
              className="text-left border border-gray-200 bg-white rounded-[14px] p-[14px] cursor-pointer transition-all duration-200 ease-in-out hover:shadow-[0_14px_34px_rgba(15,23,42,0.10)] hover:-translate-y-[2px] group"
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = template.accent;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#E5E7EB";
              }}
            >
              <TemplatePreview template={template} />
              <div
                className="flex items-center justify-between gap-3 mt-[14px]"
              >
                <div>
                  <h3 className="text-[15px] font-extrabold text-slate-800 m-0 mb-1 transition-colors group-hover:text-[var(--hover-color)]" style={{ '--hover-color': template.accent } as React.CSSProperties}>
                    {template.name}
                  </h3>
                  <p className="text-[12px] text-slate-500 leading-relaxed m-0">
                    File: {template.path.replace("/templates/", "")}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CVGenerationOverlay({
  currentStep,
  templateName,
}: {
  currentStep: number;
  templateName: string;
}) {
  return (
    <div
      className="fixed inset-0 z-[70] bg-blue-50/95 backdrop-blur-[8px] flex items-center justify-center p-6"
      role="status"
      aria-live="polite"
    >
      <div
        className="w-[min(520px,100%)] bg-white border border-blue-200 rounded-[20px] shadow-[0_24px_70px_rgba(37,99,235,0.18)] p-7 text-center"
      >
        <div
          className="w-16 h-16 rounded-[18px] bg-blue-50 flex items-center justify-center mx-auto mb-4"
        >
          <SpinnerIcon />
        </div>
        <h2 className="text-[20px] font-extrabold text-slate-800 m-0 mb-1.5">
          Generating optimized CV
        </h2>
        <p className="text-[13px] text-slate-500 m-0 mb-[22px]">
          Template: {templateName}
        </p>

        <div className="grid gap-[10px] text-left">
          {generationSteps.map((step, i) => {
            const isCompleted = i < currentStep;
            const isActive = i === currentStep;

            return (
              <div
                key={step}
                className={`cv-step-animate flex items-center gap-[10px] px-3.5 py-[11px] rounded-full text-[13px] font-bold ${isCompleted ? 'bg-blue-600 text-white' : isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-50 text-slate-400'}`}
              >
                <span
                  className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-white/20 border border-transparent' : isActive ? 'bg-white border border-blue-300' : 'bg-white border border-transparent'}`}
                >
                  {isCompleted ? <CheckIcon /> : isActive ? <SpinnerIcon /> : i + 1}
                </span>
                {step}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Section Card ─── */
function SectionCard({
  section,
  defaultOpen = false,
}: {
  section: (typeof sections)[0];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-shadow duration-200"
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between py-3.5 px-5 border-none cursor-pointer transition-colors duration-200 ${open ? 'bg-slate-50 border-b border-gray-200' : 'bg-white'}`}
      >
        <span className="text-[14px] font-bold text-slate-800">
          {section.title}
        </span>
        <div className="flex items-center gap-2">
          <ChevronIcon open={open} />
        </div>
      </button>

      {/* Body */}
      <div
        className={`overflow-hidden transition-all duration-[400ms] ease-in-out ${open ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-5">
          <h4
            className="text-[13px] font-bold text-slate-800 m-0 mb-2"
          >
            Analysis
          </h4>
          <p
            className="text-[13px] text-slate-500 leading-relaxed m-0 mb-4"
          >
            {section.analysis}
          </p>

          <h4
            className="text-[13px] font-bold text-slate-800 m-0 mb-2"
          >
            Action points:
          </h4>
          <ul className="m-0 mb-4 pl-5">
            {section.actionPoints.map((point, i) => (
              <li
                key={i}
                className="text-[13px] text-slate-500 leading-relaxed mb-2"
              >
                {point}
              </li>
            ))}
          </ul>

          <h4
            className="text-[13px] font-bold text-slate-800 m-0 mb-2"
          >
            Why It&apos;s Important For You
          </h4>
          <p
            className="text-[13px] text-slate-500 leading-relaxed m-0"
          >
            {section.importance}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Result Page ─── */
export default function CVResultPage({ onBack }: { onBack?: () => void }) {
  const jobFitScore = 76;
  const atsScore = 94;
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<(typeof cvTemplates)[0] | null>(null);
  const [generatedTemplateName, setGeneratedTemplateName] = useState<string | null>(null);

  useEffect(() => {
    if (!isGeneratingCV) return;

    if (generationStep >= generationSteps.length) {
      const timeout = setTimeout(() => {
        setIsGeneratingCV(false);
        setGenerationStep(0);
        setGeneratedTemplateName(selectedTemplate?.name ?? null);
      }, 700);

      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setGenerationStep((prev) => prev + 1);
    }, 1400);

    return () => clearTimeout(timeout);
  }, [generationStep, isGeneratingCV, selectedTemplate]);

  const handleChooseTemplate = (template: (typeof cvTemplates)[0]) => {
    setSelectedTemplate(template);
    setGeneratedTemplateName(null);
    setShowTemplatePicker(false);
    setGenerationStep(0);
    setIsGeneratingCV(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {showTemplatePicker && (
        <TemplatePickerModal
          onClose={() => setShowTemplatePicker(false)}
          onChoose={handleChooseTemplate}
        />
      )}
      {isGeneratingCV && selectedTemplate && (
        <CVGenerationOverlay
          currentStep={generationStep}
          templateName={selectedTemplate.name}
        />
      )}

      {/* ── Banner ── */}
      <div className="relative w-full h-[160px] md:h-[240px] max-w-[1048px] mx-auto overflow-hidden bg-white mt-4 md:mt-8 px-4 md:px-0">
        <img
          src="/assets/banner/result-banner.png"
          alt="Result Banner"
          className="w-full h-full object-cover rounded-xl"
        />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent rounded-xl " />
        {/* Text overlay at the top of the banner */}
        <div className="absolute top-[20%] left-0 w-full pt-8 px-6">
          <h1 className="text-[22px] md:text-[32px] font-extrabold text-white m-0 mb-2 drop-shadow-lg">
            Hasil Review CV Kamu
          </h1>
          <p className="text-[13px] md:text-[15px] text-white/80 m-0 drop-shadow-md">
            Perbaiki CV kamu agar lebih mudah dapat panggilan HR. Semangat!
          </p>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div
        className="max-w-[1080px] mx-auto px-4 md:px-5 pt-4 pb-12 grid grid-cols-1 lg:grid-cols-[1.5fr_3fr] gap-6 items-start"
      >
        {/* ─── Left Sidebar ─── */}
        <div
          className="flex flex-col gap-4 lg:sticky lg:top-[80px]"
        >
          {/* Job Fit Score */}
          <div
            className="bg-white rounded-[16px] p-6 text-center border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            <p
              className="text-[14px] font-bold italic text-slate-800 m-0 mb-3"
            >
              Job Fit Score
            </p>
            <GaugeChart score={jobFitScore} size={150} strokeWidth={14} />
          </div>

          {/* ATS Friendliness */}
          <div
            className="bg-white rounded-[16px] p-6 text-center border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            <p
              className="text-[14px] font-bold italic text-slate-800 m-0 mb-3"
            >
              ATS Friendliness
            </p>
            <DonutChart score={atsScore} size={150} strokeWidth={12} label="ATS Score" />
          </div>

          {/* Keyword Optimization */}
          {/* <div className="bg-white rounded-[16px] p-5 border border-gray-200">
            <div className="flex items-center gap-1.5 mb-3.5">
              <span className="text-[14px]">✏️</span>
              <span className="text-[13px] font-bold text-slate-800">Keyword Optimization</span>
            </div>

            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.5px] m-0 mb-2">
              Missing Keywords
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {keywordData.missing.map((kw) => (
                <span key={kw} className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-red-50 text-red-600 border border-red-200">
                  {kw}
                </span>
              ))}
            </div>

            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.5px] m-0 mb-2">
              Present Keywords
            </p>
            <div className="flex flex-wrap gap-1.5">
              {keywordData.present.map((kw) => (
                <span key={kw} className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-green-50 text-green-600 border border-green-200">
                  {kw}
                </span>
              ))}
            </div>
          </div> */}
        </div>

        {/* ─── Main Content ─── */}
        <div className="flex flex-col gap-4">
          {/* Overall Impression Card */}
          <div
            className="bg-white rounded-xl border border-gray-200 p-6 relative"
          >
            <div
              className="flex justify-between items-start"
            >
              <div className="flex-1">
                <h3
                  className="text-[15px] font-bold text-slate-800 m-0 mb-3"
                >
                  Overall Impression
                </h3>
                <p
                  className="text-[13px] text-slate-500 leading-relaxed m-0"
                >
                  {overallImpression}
                </p>
              </div>
            </div>
          </div>

          {/* Expandable Sections */}
          {sections.map((section, i) => (
            <SectionCard
              key={section.title}
              section={section}
              defaultOpen={i === 0}
            />
          ))}

          {/* ─── Matched Jobs Section ─── */}
          <div
            className="bg-white rounded-[16px] border border-gray-200 py-7 px-6"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between mb-2"
            >
              <div
                className="flex items-center gap-2.5"
              >
                <div>
                  <h3
                    className="text-[17px] font-extrabold text-slate-800 m-0 leading-[1.2]"
                  >
                    Lowongan yang Cocok dengan CV Kamu
                  </h3>
                  <p
                    className="text-[12px] text-slate-500 m-0 mt-[3px]"
                  >
                    Berdasarkan keahlian &amp; pengalaman yang terdeteksi dari
                    CV kamu
                  </p>
                </div>
              </div>
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 whitespace-nowrap"
              >
                {matchedJobs.length} lowongan
              </span>
            </div>

            {/* Divider */}
            <div
              className="h-px bg-slate-100 my-4"
            />

            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matchedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* View All Button */}
            <div
              className="flex justify-center mt-6"
            >
              <button
                className="flex items-center gap-1.5 px-7 py-2.5 rounded-full border-[1.5px] border-blue-600 bg-transparent text-blue-600 text-[14px] font-semibold cursor-pointer transition-colors duration-200 ease-in-out hover:bg-blue-50"
              >
                Lihat Semua Lowongan
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* ─── Top 3 Actionable Steps ─── */}
          <div
            className="bg-white rounded-[16px] border border-gray-200 py-7 px-6 mt-2"
          >
            <div
              className="flex items-center gap-2 mb-6"
            >
              <h3
                className="text-[18px] font-extrabold text-slate-800 m-0"
              >
                Top 3 Actionable Steps
              </h3>
            </div>

            <div
              className="flex flex-col gap-5"
            >
              {actionableSteps.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start"
                >
                  <div
                    className="w-9 h-9 rounded-[10px] bg-blue-600 flex items-center justify-center text-white text-[15px] font-extrabold shrink-0"
                  >
                    {i + 1}
                  </div>
                  <div>
                    <h4
                      className="text-[14px] font-bold text-slate-800 m-0 mb-1"
                    >
                      {step.title}
                    </h4>
                    <p
                      className="text-[13px] text-slate-500 leading-[1.65] m-0"
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Generate Optimized CV Button */}
            <div
              className="flex flex-col items-center justify-center gap-3 mt-7"
            >
              {generatedTemplateName && (
                <div
                  className="flex items-center gap-2 px-3.5 py-[9px] rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[13px] font-bold"
                >
                  <CheckIcon />
                  Optimized CV ready with {generatedTemplateName}
                </div>
              )}
              <button
                onClick={() => setShowTemplatePicker(true)}
                className="flex items-center gap-2 px-9 py-3.5 rounded-full border-none bg-gradient-to-br from-blue-600 to-blue-600 text-white text-[15px] font-bold cursor-pointer shadow-[0_4px_20px_rgba(220,38,38,0.3)] transition-transform duration-200 ease-in-out hover:-translate-y-px"
              >
                Generate Optimized CV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
