"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ─── Cloud Upload Icon ─── */
function CloudUploadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

/* ─── File Icon ─── */
function FileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

/* ─── Close Icon ─── */
function CloseIcon() {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function UploadCVStep() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = (selectedFile: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/rtf",
      "text/rtf",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Please upload a PDF, DOCX, or RTF file.");
      return;
    }
    if (selectedFile.size > maxSize) {
      alert("File size must be under 5MB.");
      return;
    }
    setFile(selectedFile);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const HandleNextStep = () => {
    router.push("/register/onboarding/job-reference");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f3f2ef] relative overflow-hidden" style={{ colorScheme: "light" }}>
      {/* Background gradient accent (top-left blue blur) */}
      <div
        className="absolute top-0 left-0 w-[420px] h-[420px] rounded-full opacity-40 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(135,190,240,0.6) 0%, rgba(200,220,245,0.2) 50%, transparent 70%)",
          transform: "translate(-30%, -30%)",
        }}
      />

      <div className="flex flex-col items-start w-full max-w-[620px] px-5">
       
          {/* Step & Progress */}
        <div className="w-full flex items-center justify-between mb-2 gap-2">
          <p className="text-xs text-gray-400 font-medium">Step 2 of 4</p>
          <p className="text-xs text-gray-400 font-medium">Upload CV</p>
        </div>

        {/* Segmented Progress Bar */}
        <div className="w-full flex items-center gap-1.5 mb-10">
          <div className="flex-1 h-[4px] bg-[#2B7FE0] rounded-full" />
          <div className="flex-1 h-[4px] bg-[#2B7FE0] rounded-full" />
          <div className="flex-1 h-[4px] bg-gray-200 rounded-full" />
          <div className="flex-1 h-[4px] bg-gray-200 rounded-full" />
        </div>

        {/* Title */}
        <h2 className="text-[28px] sm:text-[32px] font-bold text-gray-900 tracking-tight mb-3">
           Let&apos;s see what you&apos;ve done.
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-[520px]">
          Upload your resume to instantly populate your profile and match with curated opportunities.
        </p>

        {/* Main Card */}
        <div className="w-full bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">

          {/* Content */}
          <div className="px-8 pt-10 pb-8 sm:px-12 sm:pt-12 sm:pb-10">

            {/* Upload Zone */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 sm:p-10 flex flex-col items-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-[#2B7FE0] bg-blue-50/50"
                  : file
                  ? "border-green-300 bg-green-50/30"
                  : "border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/40"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.rtf"
                className="hidden"
                onChange={handleInputChange}
              />

              {!file ? (
                <>
                  {/* Upload icon */}
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                    <CloudUploadIcon />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mb-5">
                    PDF, DOCX, or RTF (max. 5MB)
                  </p>
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Browse Files
                  </button>
                </>
              ) : (
                /* File preview */
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#2B7FE0] shrink-0">
                    <FileIcon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer bg-transparent border-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    aria-label="Remove file"
                  >
                    <CloseIcon />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Divider + Actions */}
          <div className="border-t border-gray-100 px-8 py-5 sm:px-12 flex items-center justify-between">
            <button
              type="button"
              onClick={() => HandleNextStep()}
              className="text-sm font-semibold text-[#2B7FE0] hover:text-[#1d6bc4] transition-colors bg-transparent border-none cursor-pointer p-0"
            >
              Skip for now
            </button>
            <button
              type="button"
              className="px-8 py-2.5 rounded-lg bg-[#2B7FE0] text-white text-sm font-semibold hover:bg-[#2470c9] active:scale-[0.98] transition-all duration-200 border-none cursor-pointer flex items-center gap-1.5 group"
              onClick={() => HandleNextStep()}
            >
              Continue
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
