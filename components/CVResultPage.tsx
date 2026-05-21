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
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.3s ease",
      }}
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

/* ─── Score Ring Component ─── */
function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#2563EB" : score >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
}

function TemplatePreview({ template }: { template: (typeof cvTemplates)[0] }) {
  return (
    <div
      style={{
        border: "1px solid #E5E7EB",
        borderRadius: "10px",
        padding: "8px",
        background: "#F8FAFC",
        overflow: "hidden",
        height: "210px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "8px",
          background: template.accent,
          opacity: 0.08,
          borderRadius: "8px",
        }}
      />
      <iframe
        src={template.path}
        title={`${template.name} preview`}
        style={{
          width: "320%",
          height: "320%",
          border: "0",
          transform: "scale(0.3125)",
          transformOrigin: "top left",
          pointerEvents: "none",
          background: "#fff",
          borderRadius: "8px",
        }}
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
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-picker-title"
    >
      <div
        style={{
          width: "min(1120px, 100%)",
          maxHeight: "calc(100vh - 40px)",
          overflowY: "auto",
          background: "#fff",
          borderRadius: "18px",
          border: "1px solid #E5E7EB",
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.24)",
          padding: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "#2563EB",
                margin: "0 0 6px 0",
              }}
            >
              Optimized CV Template
            </p>
            <h2
              id="template-picker-title"
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#1E293B",
                margin: 0,
              }}
            >
              Pilih template CV kamu
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close template picker"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              border: "1px solid #E5E7EB",
              background: "#fff",
              color: "#64748B",
              cursor: "pointer",
              fontSize: "20px",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cvTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => onChoose(template)}
              style={{
                textAlign: "left",
                border: "1px solid #E5E7EB",
                background: "#fff",
                borderRadius: "14px",
                padding: "14px",
                cursor: "pointer",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = template.accent;
                e.currentTarget.style.boxShadow = "0 14px 34px rgba(15, 23, 42, 0.10)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#E5E7EB";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <TemplatePreview template={template} />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  marginTop: "14px",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#1E293B", margin: "0 0 4px" }}>
                    {template.name}
                  </h3>
                  <p style={{ fontSize: "12px", color: "#64748B", lineHeight: 1.5, margin: 0 }}>
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
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 70,
        background: "rgba(239, 246, 255, 0.94)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      role="status"
      aria-live="polite"
    >
      <div
        style={{
          width: "min(520px, 100%)",
          background: "#fff",
          border: "1px solid #BFDBFE",
          borderRadius: "20px",
          boxShadow: "0 24px 70px rgba(37, 99, 235, 0.18)",
          padding: "28px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "18px",
            background: "#EFF6FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <SpinnerIcon />
        </div>
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1E293B", margin: "0 0 6px" }}>
          Generating optimized CV
        </h2>
        <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 22px" }}>
          Template: {templateName}
        </p>

        <div style={{ display: "grid", gap: "10px", textAlign: "left" }}>
          {generationSteps.map((step, i) => {
            const isCompleted = i < currentStep;
            const isActive = i === currentStep;

            return (
              <div
                key={step}
                className="cv-step-animate"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "11px 14px",
                  borderRadius: "999px",
                  background: isCompleted ? "#2563EB" : isActive ? "#DBEAFE" : "#F8FAFC",
                  color: isCompleted ? "#fff" : isActive ? "#1D4ED8" : "#94A3B8",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                <span
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "999px",
                    background: isCompleted ? "rgba(255,255,255,0.2)" : "#fff",
                    border: isActive ? "1px solid #93C5FD" : "1px solid transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
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
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
        overflow: "hidden",
        transition: "box-shadow 0.2s ease",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          background: open ? "#F8FAFC" : "#fff",
          border: "none",
          borderBottom: open ? "1px solid #E5E7EB" : "none",
          cursor: "pointer",
          transition: "background 0.2s ease",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: 700, color: "#1E293B" }}>
          {section.title}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ChevronIcon open={open} />
        </div>
      </button>

      {/* Body */}
      <div
        style={{
          maxHeight: open ? "800px" : "0px",
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s ease, opacity 0.3s ease",
        }}
      >
        <div style={{ padding: "20px" }}>
          <h4
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#1E293B",
              margin: "0 0 8px 0",
            }}
          >
            Analysis
          </h4>
          <p
            style={{
              fontSize: "13px",
              color: "#64748B",
              lineHeight: 1.7,
              margin: "0 0 16px 0",
            }}
          >
            {section.analysis}
          </p>

          <h4
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#1E293B",
              margin: "0 0 8px 0",
            }}
          >
            Action points:
          </h4>
          <ul style={{ margin: "0 0 16px 0", paddingLeft: "20px" }}>
            {section.actionPoints.map((point, i) => (
              <li
                key={i}
                style={{
                  fontSize: "13px",
                  color: "#64748B",
                  lineHeight: 1.7,
                  marginBottom: "8px",
                }}
              >
                {point}
              </li>
            ))}
          </ul>

          <h4
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#1E293B",
              margin: "0 0 8px 0",
            }}
          >
            Why It&apos;s Important For You
          </h4>
          <p
            style={{
              fontSize: "13px",
              color: "#64748B",
              lineHeight: 1.7,
              margin: 0,
            }}
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
    <div style={{ background: "#F8FAFC", minHeight: "100vh" }}>
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

      {/* ── Header ── */}
      <div style={{ textAlign: "center", padding: "32px 20px 12px" }}>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#1E293B",
            margin: "0 0 6px 0",
          }}
        >
          Hasil CV Review Kamu
        </h1>
        <p style={{ fontSize: "14px", color: "#64748B", margin: 0 }}>
          Perbaiki CV kamu agar lebih mudah dapat panggilan HR. Semangat!
        </p>
      </div>

      {/* ── Main Layout ── */}
      <div
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "16px 20px 48px",
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* ─── Left Sidebar ─── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            position: "sticky",
            top: "80px",
          }}
        >
          {/* Job Fit Alignment */}
          <div
            style={{
              background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
              borderRadius: "16px",
              padding: "24px 20px",
              textAlign: "center",
              border: "1px solid #BFDBFE",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#1E40AF",
                margin: "0 0 16px 0",
              }}
            >
              JOB FIT
              <br />
              ALIGNMENT
            </p>
            <div
              style={{
                position: "relative",
                display: "inline-block",
                marginBottom: "12px",
              }}
            >
              <ScoreRing score={jobFitScore} size={110} strokeWidth={8} />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  alignItems: "baseline",
                  gap: "2px",
                }}
              >
                <span
                  style={{
                    fontSize: "36px",
                    fontWeight: 800,
                    color: "#1E293B",
                  }}
                >
                  {jobFitScore}
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#94A3B8",
                  }}
                >
                  %
                </span>
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "#212121ff", fontWeight: 600, margin: 0 }}>
              Skor kamu menunjukan kecocokan yang sangat tinggi dengan target roles kamu</p>
          </div>

          {/* ATS Friendliness */}
          <div
            style={{
              background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
              borderRadius: "16px",
              padding: "24px 20px",
              textAlign: "center",
              border: "1px solid #BFDBFE",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#1E40AF",
                margin: "0 0 12px 0",
              }}
            >
              ATS FRIENDLINESS
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                gap: "4px",
                marginBottom: "4px",
              }}
            >
              <span
                style={{ fontSize: "42px", fontWeight: 800, color: "#1E293B" }}
              >
                {atsScore}
              </span>
              <span
                style={{ fontSize: "16px", fontWeight: 600, color: "#94A3B8" }}
              >
                Score
              </span>
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "#16A34A",
                fontWeight: 600,
                margin: 0,
              }}
            >
              High parsability
            </p>
          </div>

          {/* Keyword Optimization */}
          {/* <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid #E5E7EB",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
              <span style={{ fontSize: "14px" }}>✏️</span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#1E293B" }}>Keyword Optimization</span>
            </div>

            <p style={{ fontSize: "11px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 8px 0" }}>
              Missing Keywords
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
              {keywordData.missing.map((kw) => (
                <span key={kw} style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "6px",
                  background: "#FEF2F2",
                  color: "#DC2626",
                  border: "1px solid #FECACA",
                }}>
                  {kw}
                </span>
              ))}
            </div>

            <p style={{ fontSize: "11px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 8px 0" }}>
              Present Keywords
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {keywordData.present.map((kw) => (
                <span key={kw} style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "6px",
                  background: "#F0FDF4",
                  color: "#16A34A",
                  border: "1px solid #BBF7D0",
                }}>
                  {kw}
                </span>
              ))}
            </div>
          </div> */}
        </div>

        {/* ─── Main Content ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Overall Impression Card */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              padding: "24px",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#1E293B",
                    margin: "0 0 12px 0",
                  }}
                >
                  Overall Impression
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#64748B",
                    lineHeight: 1.75,
                    margin: 0,
                  }}
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
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #E5E7EB",
              padding: "28px 24px",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "17px",
                      fontWeight: 800,
                      color: "#1E293B",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    Lowongan yang Cocok dengan CV Kamu
                  </h3>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#64748B",
                      margin: "3px 0 0 0",
                    }}
                  >
                    Berdasarkan keahlian &amp; pengalaman yang terdeteksi dari
                    CV kamu
                  </p>
                </div>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: "#EFF6FF",
                  color: "#2563EB",
                  border: "1px solid #BFDBFE",
                  whiteSpace: "nowrap",
                }}
              >
                {matchedJobs.length} lowongan
              </span>
            </div>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background: "#F1F5F9",
                margin: "16px 0 20px",
              }}
            />

            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matchedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* View All Button */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "24px",
              }}
            >
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 28px",
                  borderRadius: "9999px",
                  border: "1.5px solid #2563EB",
                  background: "transparent",
                  color: "#2563EB",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.2s ease, color 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#EFF6FF";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
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
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #E5E7EB",
              padding: "28px 24px",
              marginTop: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "24px",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#1E293B",
                  margin: 0,
                }}
              >
                Top 3 Actionable Steps
              </h3>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {actionableSteps.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "#2563EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "15px",
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#1E293B",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {step.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#64748B",
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Generate Optimized CV Button */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                marginTop: "28px",
              }}
            >
              {generatedTemplateName && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "9px 14px",
                    borderRadius: "999px",
                    background: "#EFF6FF",
                    color: "#1D4ED8",
                    border: "1px solid #BFDBFE",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  <CheckIcon />
                  Optimized CV ready with {generatedTemplateName}
                </div>
              )}
              <button
                onClick={() => setShowTemplatePicker(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 36px",
                  borderRadius: "9999px",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #2563EB 0%, #2563EB 100%)",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(220, 38, 38, 0.3)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
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
