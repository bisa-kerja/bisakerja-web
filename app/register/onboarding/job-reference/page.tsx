"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ─── Icons ─── */
function GraduationCapIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function SwitchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CloseSmallIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ─── Data ─── */
const careerStages = [
  { id: "fresh", label: "Fresh Graduate", sub: "0-1 years exp", icon: "graduation" },
  { id: "early", label: "Early Career", sub: "1-3 years exp", icon: "briefcase" },
  { id: "switcher", label: "Career Switcher", sub: "Changing paths", icon: "switch" },
];

const jobStatuses = ["Immediate Start", "Within 1 Month", "Within 3 Months", "Just Looking"];

const suggestedRoles = ["Product Manager", "Visual Designer"];

const workArrangements = ["Hybrid", "Remote", "On-site"];

export default function JobReferencePage() {
  const [selectedStage, setSelectedStage] = useState("early");
  const [selectedStatus, setSelectedStatus] = useState("Within 3 Months");
  const [targetRoles, setTargetRoles] = useState(["Product Designer", "UX Researcher"]);
  const [roleSearch, setRoleSearch] = useState("");
  const [province, setProvince] = useState("Ontario");
  const [city, setCity] = useState("Toronto");
  const [selectedArrangements, setSelectedArrangements] = useState(["Hybrid", "Remote"]);
  const router = useRouter();

  const stageIcon = (type: string, isActive: boolean) => {
    const color = isActive ? "text-white" : "text-gray-400";
    switch (type) {
      case "graduation": return <span className={color}><GraduationCapIcon /></span>;
      case "briefcase": return <span className={color}><BriefcaseIcon /></span>;
      case "switch": return <span className={color}><SwitchIcon /></span>;
      default: return null;
    }
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

  const toggleArrangement = (arrangement: string) => {
    setSelectedArrangements((prev) =>
      prev.includes(arrangement)
        ? prev.filter((a) => a !== arrangement)
        : [...prev, arrangement]
    );
  };

  const HandleBackStep= () => {
    router.push("/register/onboarding/upload-cv");
  }


  const HandleNextStep = () => {
    router.push("/register/onboarding/verify-email");
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ colorScheme: "light" }}>
      {/* ─── Main Content ─── */}
      <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-10 pb-16">
        {/* Step & Progress */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-400 font-medium">Step 3 of 4</p>
          <p className="text-xs text-gray-400 font-medium">Career Preferences</p>
        </div>

        {/* Segmented Progress Bar */}
        <div className="flex items-center gap-1.5 mb-10">
          <div className="flex-1 h-[4px] bg-[#2B7FE0] rounded-full" />
          <div className="flex-1 h-[4px] bg-[#2B7FE0] rounded-full" />
          <div className="flex-1 h-[4px] bg-[#2B7FE0] rounded-full" />
          <div className="flex-1 h-[4px] bg-gray-200 rounded-full" />
        </div>

        {/* Title */}
        <h2 className="text-[28px] sm:text-[32px] font-bold text-gray-900 tracking-tight mb-3">
          What are you looking for?
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-[520px]">
          Help us tailor your Atelier experience by sharing your career stage and current objectives.
        </p>

        {/* ─── Form Card ─── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_8px_rgba(0,0,0,0.04)] p-6 sm:p-8">
          {/* Current Career Stage */}
          <div className="mb-8">
            <h3 className="text-base font-bold text-gray-900 mb-4">Current Career Stage</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {careerStages.map((stage) => {
                const isActive = selectedStage === stage.id;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setSelectedStage(stage.id)}
                    className={`relative flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer bg-transparent text-left ${
                      isActive
                        ? "border-[#2B7FE0] bg-[#2B7FE0]/[0.03]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${isActive ? "text-gray-900" : "text-gray-700"}`}>
                        {stage.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${isActive ? "text-[#2B7FE0]" : "text-gray-400"}`}>
                        {stage.sub}
                      </p>
                    </div>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? "bg-[#2B7FE0]" : "bg-gray-100"
                    }`}>
                      {stageIcon(stage.icon, isActive)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Job Seeking Status */}
          <div className="mb-8">
            <h3 className="text-base font-bold text-gray-900 mb-4">Job Seeking Status</h3>
            <div className="flex flex-wrap gap-2.5">
              {jobStatuses.map((status) => {
                const isActive = selectedStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`px-5 py-2 rounded-full border text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#2B7FE0] text-white border-[#2B7FE0]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Roles */}
          <div className="mb-8">
            <h3 className="text-base font-bold text-gray-900 mb-4">Target Roles</h3>

            {/* Search Input */}
            <div className="relative flex items-center mb-3">
              <span className="absolute left-3.5 text-gray-400">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search roles (e.g., Product Designer, Data Analyst)"
                className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white outline-none placeholder:text-gray-400 focus:border-[#2B7FE0] focus:ring-[3px] focus:ring-[#2B7FE0]/[0.08] transition-all duration-200"
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
                onKeyDown={handleRoleKeyDown}
              />
            </div>

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {targetRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2B7FE0] text-white text-sm font-medium"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => removeRole(role)}
                    className="flex items-center justify-center bg-transparent border-none cursor-pointer text-white/80 hover:text-white transition-colors p-0"
                    aria-label={`Remove ${role}`}
                  >
                    <CloseSmallIcon />
                  </button>
                </span>
              ))}
            </div>

            {/* Suggested */}
            <p className="text-[11px] font-semibold text-gray-400 tracking-[0.08em] uppercase mb-2">
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
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer font-medium"
                  >
                    + {role}
                  </button>
                ))}
            </div>
          </div>

          {/* Preferred Location & Work Arrangement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Preferred Location */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-4">Preferred Location</h3>

              {/* Province */}
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Province / State</label>
                <div className="relative">
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full h-11 px-3.5 pr-10 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white outline-none appearance-none cursor-pointer focus:border-[#2B7FE0] focus:ring-[3px] focus:ring-[#2B7FE0]/[0.08] transition-all duration-200"
                  >
                    <option value="Ontario">Ontario</option>
                    <option value="Quebec">Quebec</option>
                    <option value="British Columbia">British Columbia</option>
                    <option value="Alberta">Alberta</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>

              {/* City */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">City</label>
                <div className="relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-11 px-3.5 pr-10 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white outline-none appearance-none cursor-pointer focus:border-[#2B7FE0] focus:ring-[3px] focus:ring-[#2B7FE0]/[0.08] transition-all duration-200"
                  >
                    <option value="Toronto">Toronto</option>
                    <option value="Ottawa">Ottawa</option>
                    <option value="Mississauga">Mississauga</option>
                    <option value="Hamilton">Hamilton</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>
            </div>

            {/* Work Arrangement */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-4">Work Arrangement</h3>
              <div className="flex flex-col gap-0">
                {workArrangements.map((arrangement) => {
                  const isChecked = selectedArrangements.includes(arrangement);
                  return (
                    <label
                      key={arrangement}
                      className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50/50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleArrangement(arrangement)}
                        className="w-[18px] h-[18px] accent-[#2B7FE0] cursor-pointer shrink-0 rounded"
                      />
                      <span className="text-sm text-gray-700 font-medium">{arrangement}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Bottom Actions ─── */}
        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={() => HandleBackStep()}
            className="text-sm font-semibold text-[#2B7FE0] hover:text-[#1d6bc4] transition-colors bg-transparent border-none cursor-pointer p-0"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => HandleNextStep()}
            className="px-8 py-3 rounded-lg bg-[#2B7FE0] text-white text-sm font-semibold hover:bg-[#2470c9] active:scale-[0.98] transition-all duration-200 border-none cursor-pointer flex items-center gap-1.5 group"
          >
            Continue to Final Step
          </button>
        </div>
      </div>
    </div>
  );
}
