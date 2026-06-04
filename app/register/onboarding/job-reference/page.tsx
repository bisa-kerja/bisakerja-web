"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { updatePreferences, PreferencesUpsertRequest } from "@/lib/api";

/* ─── Icons ─── */
function GraduationCapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function SwitchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CloseSmallIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

type SearchableDropdownOption = {
  label: string;
  value: string;
};

function SearchableDropdown({
  value,
  options,
  placeholder,
  searchPlaceholder,
  loadingMessage,
  emptyMessage,
  isLoading = false,
  disabled = false,
  onChange,
}: {
  value: string;
  options: SearchableDropdownOption[];
  placeholder: string;
  searchPlaceholder: string;
  loadingMessage: string;
  emptyMessage: string;
  isLoading?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((option) => option.value === value);
  const filteredOptions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return options;

    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedSearch),
    );
  }, [options, search]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const timeoutId = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => {
          if (disabled || isLoading) return;
          setIsOpen((current) => !current);
        }}
        disabled={disabled || isLoading}
        className={`flex h-11 w-full items-center justify-between gap-2 rounded-lg border bg-white px-3.5 text-left text-sm transition-colors ${
          value
            ? "border-blue-300 text-gray-900"
            : "border-gray-200 text-gray-400"
        } ${
          disabled || isLoading
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:border-gray-300 hover:bg-gray-50 focus:border-[#2B7FE0] focus:outline-none focus:ring-[3px] focus:ring-[#2B7FE0]/[0.08]"
        }`}
      >
        <span className="min-w-0 flex-1 truncate">
          {isLoading ? loadingMessage : selectedOption?.label || placeholder}
        </span>
        <span className="shrink-0 text-gray-400">
          {isLoading ? <SpinnerIcon /> : <ChevronDownIcon />}
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-20 mt-1 w-full min-w-[220px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
          <div className="px-2 pb-2">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400">
                <SearchIcon />
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-[13px] text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#2B7FE0] focus:ring-[3px] focus:ring-[#2B7FE0]/[0.08]"
              />
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setSearch("");
                      setIsOpen(false);
                    }}
                    className={`w-full border-none bg-transparent px-3 py-2 text-left text-[13px] transition-colors ${
                      isSelected
                        ? "bg-blue-50 font-medium text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-2 text-[13px] text-gray-400">
                {emptyMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Data ─── */
const careerStages = [
  {
    id: "fresh",
    label: "Fresh Graduate",
    sub: "0-1 years exp",
    icon: "graduation",
  },
  {
    id: "early",
    label: "Early Career",
    sub: "1-3 years exp",
    icon: "briefcase",
  },
  {
    id: "switcher",
    label: "Career Switcher",
    sub: "Changing paths",
    icon: "switch",
  },
];

const jobStatuses = [
  "Immediate Start",
  "Within 1 Month",
  "Within 3 Months",
  "Just Looking",
];

const suggestedRoles = ["Product Manager", "Visual Designer", "Software Engineer", "Data Analyst", "Marketing Specialist", "Project Manager"];

const workArrangements = ["Hybrid", "Remote", "On-site"];

export default function JobReferencePage() {
  const [selectedStage, setSelectedStage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [roleSearch, setRoleSearch] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [cities, setCities] = useState<
    { id: string; province_id: string; name: string }[]
  >([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [selectedArrangements, setSelectedArrangements] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  // Fetch all Indonesian provinces from the official wilayah API on mount
  useEffect(() => {
    fetch("/api/wilayah/provinces")
      .then((res) => res.json())
      .then((data: { id: string; name: string }[]) => {
        setProvinces(data);
        const defaultProvince = data.find((p) => p.id === "31"); // DKI JAKARTA
        if (defaultProvince) {
          setSelectedProvinceId(defaultProvince.id);
          setProvince(defaultProvince.name);
          setIsLoadingCities(true);
        }
      })
      .catch((err) => console.error("Failed to fetch provinces:", err))
      .finally(() => setIsLoadingProvinces(false));
  }, []);

  // Fetch cities/regencies whenever the selected province ID changes
  useEffect(() => {
    if (!selectedProvinceId) return;
    fetch(`/api/wilayah/regencies/${selectedProvinceId}`)
      .then((res) => res.json())
      .then((data: { id: string; province_id: string; name: string }[]) => {
        setCities(data);
        if (data.length > 0) setCity(data[0].name);
      })
      .catch((err) => console.error("Failed to fetch cities:", err))
      .finally(() => setIsLoadingCities(false));
  }, [selectedProvinceId]);

  const provinceOptions = useMemo(
    () => provinces.map((item) => ({ label: item.name, value: item.id })),
    [provinces],
  );

  const cityOptions = useMemo(
    () => cities.map((item) => ({ label: item.name, value: item.name })),
    [cities],
  );

  const handleProvinceChange = (id: string) => {
    const found = provinces.find((p) => p.id === id);
    setSelectedProvinceId(id);
    setProvince(found?.name ?? "");
    setCities([]);
    setCity("");
    if (id) setIsLoadingCities(true);

    if (found) {
      setFieldErrors((e2) => {
        const copy = { ...e2 };
        delete copy.province;
        return copy;
      });
    }
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    if (value) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy.city;
        return copy;
      });
    }
  };

  const stageIcon = (type: string, isActive: boolean) => {
    const color = isActive ? "text-white" : "text-gray-400";
    switch (type) {
      case "graduation":
        return (
          <span className={color}>
            <GraduationCapIcon />
          </span>
        );
      case "briefcase":
        return (
          <span className={color}>
            <BriefcaseIcon />
          </span>
        );
      case "switch":
        return (
          <span className={color}>
            <SwitchIcon />
          </span>
        );
      default:
        return null;
    }
  };

  const removeRole = (role: string) => {
    setTargetRoles(targetRoles.filter((r) => r !== role));
  };

  const addRole = (role: string) => {
    if (!targetRoles.includes(role)) {
      setTargetRoles([...targetRoles, role]);
      setFieldErrors((e) => { const copy = { ...e }; delete copy.roles; return copy; });
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
    setSelectedArrangements((prev) => {
      const next = prev.includes(arrangement)
        ? prev.filter((a) => a !== arrangement)
        : [...prev, arrangement];
      if (next.length > 0) {
        setFieldErrors((e) => { const copy = { ...e }; delete copy.arrangements; return copy; });
      }
      return next;
    });
  };

  const validateFields = (): boolean => {
    const errors: Record<string, string> = {};
    if (!selectedStage) errors.stage = "Please select your career stage.";
    if (!selectedStatus) errors.status = "Please select your job seeking status.";
    if (targetRoles.length === 0) errors.roles = "Please add at least one target role.";
    if (!province) errors.province = "Please select a province.";
    if (!city) errors.city = "Please select a city.";
    if (selectedArrangements.length === 0) errors.arrangements = "Please select at least one work arrangement.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const HandleBackStep = () => {
    router.push("/register/onboarding/upload-cv");
  };

  const HandleNextStep = async () => {
    if (!validateFields()) return;
    setIsSubmitting(true);
    setApiError(null);

    try {
      const payload: PreferencesUpsertRequest = {
        careerStatus:
          selectedStage === "fresh"
            ? "FRESH_GRADUATE"
            : selectedStage === "early"
              ? "EARLY_CAREER"
              : "CAREER_SWITCHER",
        jobSeekingStatus:
          selectedStatus === "Immediate Start"
            ? "IMMEDIATE"
            : selectedStatus === "Within 1 Month"
              ? "ONE_MONTH"
              : "THREE_MONTHS",
        targetRoles: targetRoles,
        locations: [{ province, city }],
        workTypes: selectedArrangements.filter(Boolean).map((arr) => {
          if (arr === "Hybrid") return "HYBRID";
          if (arr === "Remote") return "REMOTE";
          return "ONSITE";
        }) as ("REMOTE" | "HYBRID" | "ONSITE")[],
        emailNotificationsEnabled: true,
      };

      await updatePreferences(payload);
      router.push("/register/onboarding/verify-email");
    } catch (err) {
      const error = err as Error;
      setApiError(
        error.message || "Failed to save preferences. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ colorScheme: "light" }}>
      {/* ─── Main Content ─── */}
      <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-10 pb-16">
        {/* Step & Progress */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-400 font-medium">Step 2 of 3</p>
          <p className="text-xs text-gray-400 font-medium">
            Career Preferences
          </p>
        </div>

        {/* Segmented Progress Bar */}
        <div className="flex items-center gap-1.5 mb-10">
          <div className="flex-1 h-[4px] bg-[#2B7FE0] rounded-full" />
          <div className="flex-1 h-[4px] bg-[#2B7FE0] rounded-full" />
          <div className="flex-1 h-[4px] bg-gray-200 rounded-full" />
        </div>

        {/* Title */}
        <h2 className="text-[28px] sm:text-[32px] font-bold text-gray-900 tracking-tight mb-3">
          What are you looking for?
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-[520px]">
          Help us tailor your Atelier experience by sharing your career stage
          and current objectives.
        </p>

        {apiError && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 mt-0.5 text-red-500"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <span>{apiError}</span>
          </div>
        )}

        {/* ─── Form Card ─── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_8px_rgba(0,0,0,0.04)] p-6 sm:p-8">
          {/* Current Career Stage */}
          <div className="mb-8">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Current Career Stage
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {careerStages.map((stage) => {
                const isActive = selectedStage === stage.id;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => {
                      setSelectedStage(stage.id);
                      setFieldErrors((e) => { const copy = { ...e }; delete copy.stage; return copy; });
                    }}
                    className={`relative flex items-center gap-3 px-4 py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer bg-transparent text-left ${
                      isActive
                        ? "border-[#2B7FE0] bg-[#2B7FE0]/[0.03]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold ${isActive ? "text-gray-900" : "text-gray-700"}`}
                      >
                        {stage.label}
                      </p>
                      <p
                        className={`text-xs mt-0.5 ${isActive ? "text-[#2B7FE0]" : "text-gray-400"}`}
                      >
                        {stage.sub}
                      </p>
                    </div>
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive ? "bg-[#2B7FE0]" : "bg-gray-100"
                      }`}
                    >
                      {stageIcon(stage.icon, isActive)}
                    </div>
                  </button>
                );
              })}
            </div>
            {fieldErrors.stage && (
              <p className="text-xs text-red-500 mt-2 font-medium">{fieldErrors.stage}</p>
            )}
          </div>

          {/* Job Seeking Status */}
          <div className="mb-8">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Job Seeking Status
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {jobStatuses.map((status) => {
                const isActive = selectedStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(status);
                      setFieldErrors((e) => { const copy = { ...e }; delete copy.status; return copy; });
                    }}
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
            {fieldErrors.status && (
              <p className="text-xs text-red-500 mt-2 font-medium">{fieldErrors.status}</p>
            )}
          </div>

          {/* Target Roles */}
          <div className="mb-8">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Target Roles
            </h3>

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
              {targetRoles && targetRoles.map((role) => (
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
            {fieldErrors.roles && (
              <p className="text-xs text-red-500 mt-2 font-medium">{fieldErrors.roles}</p>
            )}
          </div>

          {/* Preferred Location & Work Arrangement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Preferred Location */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-4">
                Preferred Location
              </h3>

              {/* Province */}
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                  Province
                </label>
                <SearchableDropdown
                  value={selectedProvinceId}
                  options={provinceOptions}
                  placeholder="Select province"
                  searchPlaceholder="Search province"
                  loadingMessage="Loading provinces..."
                  emptyMessage="No provinces found"
                  isLoading={isLoadingProvinces}
                  onChange={handleProvinceChange}
                />
                {fieldErrors.province && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">{fieldErrors.province}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                  City / Regency
                </label>
                <SearchableDropdown
                  value={city}
                  options={cityOptions}
                  placeholder={
                    selectedProvinceId ? "Select city / regency" : "Select province first"
                  }
                  searchPlaceholder="Search city / regency"
                  loadingMessage="Loading cities..."
                  emptyMessage="No cities found"
                  isLoading={isLoadingCities}
                  disabled={!selectedProvinceId || cityOptions.length === 0}
                  onChange={handleCityChange}
                />
                {fieldErrors.city && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">{fieldErrors.city}</p>
                )}
              </div>
            </div>

            {/* Work Arrangement */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-4">
                Work Arrangement
              </h3>
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
                      <span className="text-sm text-gray-700 font-medium">
                        {arrangement}
                      </span>
                    </label>
                  );
                })}
              </div>
              {fieldErrors.arrangements && (
                <p className="text-xs text-red-500 mt-2 font-medium">{fieldErrors.arrangements}</p>
              )}
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
            disabled={isSubmitting}
            className="px-8 py-3 rounded-lg bg-[#2B7FE0] text-white text-sm font-semibold hover:bg-[#2470c9] active:scale-[0.98] transition-all duration-200 border-none cursor-pointer flex items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting && <SpinnerIcon />}
            {isSubmitting ? "Saving..." : "Continue to Final Step"}
          </button>
        </div>
      </div>
    </div>
  );
}
