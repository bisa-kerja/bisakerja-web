"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  APIError,
  CV_ANALYZER_CONTEXT_STORAGE_KEY,
  CV_ANALYZER_RESULT_STORAGE_KEY,
  type CVAnalyzerResponse,
  type CVJobRecommendation,
  type CVAnalysisResult,
  generateOptimizedCV,
} from "@/lib/api";

interface DisplaySectionReview {
  title: string;
  analysis: string;
  actionPoints: string[];
  importance: string;
}

interface CVAnalyzerStoredContext {
  cvFileId: string | null;
  originalFileName?: string | null;
}

interface GeneratedCVPreview {
  previewHtml: string | null;
  previewUrl: string | null;
  downloadUrl: string | null;
  downloadFileName: string;
}

/* ─── Icon Components ─── */
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

/* ─── Fallback Data ─── */
const overallImpression = `Overall, your CV leaves an exceptionally strong impression. It is well-structured, highly engaging, and immediately captures attention with its clear presentation of technical skills and quantifiable achievements. The depth of your work experience, coupled with impressive competition wins and a clear professional summary, makes this a standout resume. It effectively communicates your expertise as a Front End Developer and your passion for the field.`;

const sections: DisplaySectionReview[] = [
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

const actionableSteps = [
  "Strengthen the professional summary with target-role keywords and measurable impact.",
  "Integrate missing technical skills into a clearer skills section.",
  "Keep dates and work-history formatting consistent for better ATS parsing.",
];

const cvTemplates = [
  { id: "template-1", name: "Template 1", path: "/templates/template-2.html", accent: "#2563EB" },
  { id: "template-2", name: "Template 2", path: "/templates/template-3.html", accent: "#0D9488" },
  { id: "template-3", name: "Template 3", path: "/templates/template-8.html", accent: "#7C3AED" },
  { id: "template-4", name: "Template 4", path: "/templates/template-10.html", accent: "#4B5563" },
  { id: "template-5", name: "Template 5", path: "/templates/template-15.html", accent: "#0891B2" },
  { id: "template-6", name: "Template 6", path: "/templates/template-18.html", accent: "#9333EA" },
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
        className="text-[14px] font-bold m-0 mt-2"
        style={{ color: color }}
      >
        {score >= 80 ? "Strong fit" : score >= 60 ? "Good fit" : "Needs work"}
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
            <h2
              id="template-picker-title"
              className="text-[22px] font-extrabold text-slate-800 m-0"
            >
              Choose your CV template
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
  section: DisplaySectionReview;
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

function JobRecommendationCard({ job }: { job: CVJobRecommendation }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="m-0 text-[15px] font-extrabold text-slate-800">
            {job.title}
          </h4>
          <p className="m-0 mt-1 text-[13px] font-semibold text-slate-500">
            {job.companyName}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[12px] font-extrabold text-blue-700">
          {job.matchScore}%
        </span>
      </div>

      <p className="m-0 mt-4 text-[13px] leading-relaxed text-slate-500">
        {job.reason}
      </p>

      <div className="mt-4 rounded-xl bg-slate-50 px-3.5 py-3">
        <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.7px] text-slate-400">
          Next step
        </p>
        <p className="m-0 mt-1 text-[13px] leading-relaxed text-slate-600">
          {job.nextStep}
        </p>
      </div>
    </div>
  );
}

function readStoredCVAnalysis(): CVAnalyzerResponse | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(CV_ANALYZER_RESULT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CVAnalyzerResponse;
  } catch {
    return null;
  }
}

function readStoredCVContext(): CVAnalyzerStoredContext | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(CV_ANALYZER_CONTEXT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CVAnalyzerStoredContext;
  } catch {
    return null;
  }
}

function buildGenerationSummary(analysis: CVAnalysisResult | undefined): string {
  if (!analysis) return overallImpression;

  const summaryParts = [
    analysis.overallImpression,
    analysis.jobFitAlignment.summary,
    analysis.atsFriendliness.summary,
    analysis.topActionables.length > 0
      ? `Optimization focus: ${analysis.topActionables.join(" ")}`
      : "",
  ].filter(Boolean);

  return summaryParts.join("\n\n");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function findStringByKeys(
  value: unknown,
  keys: string[],
  predicate: (candidate: string) => boolean,
): string | null {
  const queue: unknown[] = [value];
  const visited = new Set<unknown>();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!isRecord(current) || visited.has(current)) continue;
    visited.add(current);

    for (const key of keys) {
      const candidate = current[key];
      if (typeof candidate === "string" && predicate(candidate)) {
        return candidate;
      }
    }

    Object.values(current).forEach((child) => {
      if (isRecord(child) || Array.isArray(child)) queue.push(child);
      if (Array.isArray(child)) queue.push(...child);
    });
  }

  return null;
}

function extractGeneratedCVPreview(
  responseData: unknown,
  fallbackFileName: string,
): GeneratedCVPreview {
  const htmlKeys = [
    "html",
    "templateHtml",
    "previewHtml",
    "generatedHtml",
    "htmlContent",
    "cvHtml",
    "content",
  ];
  const urlKeys = [
    "downloadUrl",
    "pdfUrl",
    "fileUrl",
    "cvUrl",
    "generatedCvUrl",
    "url",
  ];
  const fileNameKeys = ["fileName", "filename", "downloadFileName", "name"];

  const stringData = typeof responseData === "string" ? responseData : null;
  const previewHtml =
    stringData && stringData.includes("<")
      ? stringData
      : findStringByKeys(responseData, htmlKeys, (candidate) =>
          candidate.includes("<"),
        );
  const downloadUrl =
    stringData && /^(https?:|blob:|data:|\/)/.test(stringData)
      ? stringData
      : findStringByKeys(responseData, urlKeys, (candidate) =>
          /^(https?:|blob:|data:|\/)/.test(candidate),
        );
  const downloadFileName =
    findStringByKeys(responseData, fileNameKeys, (candidate) =>
      candidate.trim().length > 0,
    ) ?? fallbackFileName;

  return {
    previewHtml,
    previewUrl: previewHtml ? null : downloadUrl,
    downloadUrl,
    downloadFileName,
  };
}

/* ─── Main Result Page ─── */
export default function CVResultPage() {
  const [analysisResponse, setAnalysisResponse] =
    useState<CVAnalyzerResponse | null>(null);
  const [analysisContext, setAnalysisContext] =
    useState<CVAnalyzerStoredContext | null>(null);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<(typeof cvTemplates)[0] | null>(null);
  const [generatedTemplateName, setGeneratedTemplateName] = useState<string | null>(null);
  const [generatedCV, setGeneratedCV] = useState<GeneratedCVPreview | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const analysis = analysisResponse?.data.analysisResult;
  const jobFitScore = analysis?.jobFitAlignment.score ?? 76;
  const atsScore = analysis?.atsFriendliness.score ?? 94;
  const displayedOverallImpression =
    analysis?.overallImpression ?? overallImpression;
  const displayedSections =
    analysis?.sectionReviews.map((section) => ({
      title: section.sectionName,
      analysis: section.analysis,
      actionPoints: section.actionPoints,
      importance: section.whyItsImportantForYou,
    })) ?? sections;
  const displayedActionables = analysis?.topActionables ?? actionableSteps;
  const jobRecommendations = analysis?.jobRecommendations ?? [];

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setAnalysisResponse(readStoredCVAnalysis());
      setAnalysisContext(readStoredCVContext());
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isGeneratingCV) return;

    const timeout = setTimeout(() => {
      setGenerationStep((prev) =>
        Math.min(prev + 1, generationSteps.length - 1),
      );
    }, 1400);

    return () => clearTimeout(timeout);
  }, [generationStep, isGeneratingCV]);

  useEffect(() => {
    return () => {
      if (generatedCV?.downloadUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(generatedCV.downloadUrl);
      }
    };
  }, [generatedCV?.downloadUrl]);

  const handleChooseTemplate = async (template: (typeof cvTemplates)[0]) => {
    const cvFileId = analysisContext?.cvFileId;

    if (!cvFileId) {
      setShowTemplatePicker(false);
      setGenerationError(
        "CV file reference is missing. Please run the CV analysis again before generating an optimized CV.",
      );
      return;
    }

    setSelectedTemplate(template);
    setGeneratedTemplateName(null);
    setGeneratedCV(null);
    setGenerationError(null);
    setShowTemplatePicker(false);
    setGenerationStep(0);
    setIsGeneratingCV(true);

    try {
      const templateResponse = await fetch(template.path);
      if (!templateResponse.ok) {
        throw new Error("Failed to load selected CV template.");
      }

      const templateHtml = await templateResponse.text();
      const response = await generateOptimizedCV({
        cvFileId,
        summary: buildGenerationSummary(analysis),
        templateHtml,
      });
      const generatedPreview = extractGeneratedCVPreview(
        response.data,
        `${template.name.toLowerCase().replace(/\s+/g, "-")}-optimized-cv.html`,
      );

      if (!generatedPreview.previewHtml && !generatedPreview.previewUrl) {
        throw new Error("The generated CV response did not include preview content.");
      }

      if (!generatedPreview.downloadUrl && generatedPreview.previewHtml) {
        generatedPreview.downloadUrl = URL.createObjectURL(
          new Blob([generatedPreview.previewHtml], { type: "text/html" }),
        );
      }

      setGeneratedCV(generatedPreview);
      setGeneratedTemplateName(template.name);
    } catch (error) {
      if (error instanceof APIError && error.status === 401) {
        setGenerationError("Please log in again before generating your optimized CV.");
      } else {
        setGenerationError(
          error instanceof Error
            ? error.message
            : "Failed to generate optimized CV. Please try again.",
        );
      }
    } finally {
      setIsGeneratingCV(false);
      setGenerationStep(0);
    }
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
        <Image
          src="/assets/banner/result-banner.png"
          alt="Result Banner"
          className="w-full h-full object-cover rounded-xl"
          width={1048}
          height={240}
          priority
        />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent rounded-xl " />
        {/* Text overlay at the top of the banner */}
        <div className="absolute top-[20%] left-0 w-full pt-8 px-6">
          <h1 className="text-[22px] md:text-[32px] font-extrabold text-white m-0 mb-2 drop-shadow-lg">
            Your CV Review Result
          </h1>
          <p className="text-[13px] md:text-[15px] text-white/80 m-0 drop-shadow-md">
            {analysisResponse
              ? `Target role: ${analysisResponse.data.jobRoles.join(", ")}`
              : "Fix your CV to get more HR calls. Keep it up!"}
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
            {analysis?.jobFitAlignment.summary && (
              <p className="m-0 mt-4 text-[12px] leading-relaxed text-slate-500">
                {analysis.jobFitAlignment.summary}
              </p>
            )}
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
            {analysis?.atsFriendliness.summary && (
              <p className="m-0 mt-4 text-[12px] leading-relaxed text-slate-500">
                {analysis.atsFriendliness.summary}
              </p>
            )}
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
                  {displayedOverallImpression}
                </p>
              </div>
            </div>
          </div>

          {/* Expandable Sections */}
          {displayedSections.map((section, i) => (
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
                    Jobs Matching Your CV
                  </h3>
                  <p
                    className="text-[12px] text-slate-500 m-0 mt-[3px]"
                  >
                    Based on skills & experience detected from
                    your CV
                  </p>
                </div>
              </div>
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 whitespace-nowrap"
              >
                {jobRecommendations.length} job{jobRecommendations.length === 1 ? "" : "s"}
              </span>
            </div>

            {/* Divider */}
            <div
              className="h-px bg-slate-100 my-4"
            />

            {/* Job Cards Grid */}
            {jobRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {jobRecommendations.map((job) => (
                  <JobRecommendationCard key={job.jobId} job={job} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 bg-slate-50 px-5 py-6 text-center">
                <p className="m-0 text-[13px] font-semibold text-slate-500">
                  Job recommendations will appear after CV analysis is complete.
                </p>
              </div>
            )}

            {/* View All Button */}
            <div
              className="flex justify-center mt-6"
            >
              <button
                className="flex items-center gap-1.5 px-7 py-2.5 rounded-full border-[1.5px] border-blue-600 bg-transparent text-blue-600 text-[14px] font-semibold cursor-pointer transition-colors duration-200 ease-in-out hover:bg-blue-50"
              >
                View All Jobs
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
              {displayedActionables.map((step, i) => (
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
                      Recommendation {i + 1}
                    </h4>
                    <p
                      className="text-[13px] text-slate-500 leading-[1.65] m-0"
                    >
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Generate Optimized CV Button */}
            <div
              className="flex flex-col items-center justify-center gap-3 mt-7"
            >
              {generationError && (
                <div className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-[13px] font-semibold text-red-700">
                  {generationError}
                </div>
              )}
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
                className="flex items-center gap-2 px-9 py-3.5 rounded-full border-none bg-gradient-to-br from-blue-600 to-blue-600 text-white text-[15px] font-bold cursor-pointer transition-transform duration-200 ease-in-out hover:-translate-y-px"
              >
                Generate Optimized CV
              </button>
            </div>
          </div>

          {generatedCV && (
            <div className="bg-white rounded-[16px] border border-gray-200 py-7 px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-[18px] font-extrabold text-slate-800 m-0">
                    Generated CV Preview
                  </h3>
                  <p className="text-[12px] text-slate-500 m-0 mt-[3px]">
                    {generatedTemplateName
                      ? `Optimized with ${generatedTemplateName}`
                      : "Optimized CV is ready"}
                  </p>
                </div>
                {generatedCV.downloadUrl && (
                  <a
                    href={generatedCV.downloadUrl}
                    download={generatedCV.downloadFileName}
                    target={
                      generatedCV.downloadUrl.startsWith("blob:")
                        ? undefined
                        : "_blank"
                    }
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-[13px] font-bold text-white transition-transform duration-200 ease-in-out hover:-translate-y-px"
                  >
                    Download CV
                  </a>
                )}
              </div>

              <div className="mt-5 h-[720px] overflow-hidden rounded-xl border border-gray-200 bg-slate-100">
                {generatedCV.previewHtml ? (
                  <iframe
                    title="Generated optimized CV preview"
                    srcDoc={generatedCV.previewHtml}
                    className="h-full w-full border-0 bg-white"
                  />
                ) : generatedCV.previewUrl ? (
                  <iframe
                    title="Generated optimized CV preview"
                    src={generatedCV.previewUrl}
                    className="h-full w-full border-0 bg-white"
                  />
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
