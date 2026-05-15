"use client";

import { useState } from "react";
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

/* ─── Mock Data ─── */
const overallImpression = `Overall, your CV leaves an exceptionally strong impression. It is well-structured, highly engaging, and immediately captures attention with its clear presentation of technical skills and quantifiable achievements. The depth of your work experience, coupled with impressive competition wins and a clear professional summary, makes this a standout resume. It effectively communicates your expertise as a Front End Developer and your passion for the field.`;

const sections = [
  {
    title: "Contact Information",
    score: 98,
    analysis: `Your contact information is exceptionally complete and well-presented. You've included your full name, phone number, email address, LinkedIn profile, GitHub, and even a personal portfolio link. This provides recruiters with multiple avenues to connect with you and review your work, which is highly beneficial.`,
    actionPoints: [
      "Ensure all links, especially your GitHub and portfolio, are active and showcase your best and most recent projects. A broken link can be a missed opportunity.",
      "While your email is functional, consider using a more professional email address that aligns with your name, such as 'agil.saputra@email.com', if 'ragelyusuf752@gmail.com' is not your primary professional one.",
    ],
    importance: `Complete and accurate contact information is paramount as it's the primary way recruiters will reach out to you. Including professional links like LinkedIn, GitHub, and a portfolio demonstrates your commitment to your craft and provides immediate access to your professional network and coding samples, significantly enhancing your credibility and visibility.`,
  },
  {
    title: "Relevant Skills",
    score: 98,
    analysis: `Your skills section is comprehensive and well-organized, covering a wide range of relevant front-end technologies and tools. The inclusion of both technical skills and soft skills provides a balanced view of your capabilities.`,
    actionPoints: [
      "Consider grouping skills by category (e.g., Languages, Frameworks, Tools) for better readability.",
      "Add proficiency levels to key skills to give recruiters a clearer picture of your expertise.",
    ],
    importance: `A well-curated skills section helps ATS systems match your profile with job requirements and gives hiring managers a quick overview of your technical capabilities.`,
  },
  {
    title: "Professional Summary",
    score: 85,
    analysis: `Your professional summary provides a good overview but could be more targeted. It mentions your experience but lacks specific metrics and achievements that would make it more impactful.`,
    actionPoints: [
      "Add quantifiable achievements to your summary (e.g., 'improved page load times by 40%').",
      "Tailor the summary to explicitly mention B2B SaaS experience as required by the Target Role.",
    ],
    importance: `The professional summary is often the first section recruiters read. A compelling, targeted summary can significantly increase the chances of your CV being shortlisted.`,
  },
  {
    title: "Work Experience",
    score: 92,
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

/* ─── Section Card ─── */
function SectionCard({
  section,
  defaultOpen = false,
}: {
  section: (typeof sections)[0];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const scoreColor =
    section.score >= 90
      ? "#2563EB"
      : section.score >= 70
        ? "#F59E0B"
        : "#EF4444";

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
          <span
            style={{ fontSize: "13px", fontWeight: 700, color: scoreColor }}
          >
            SCORE {section.score}%
          </span>
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

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh" }}>
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
                justifyContent: "center",
                marginTop: "28px",
              }}
            >
              <button
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
