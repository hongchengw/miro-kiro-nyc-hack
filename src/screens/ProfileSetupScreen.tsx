import React, { useState } from "react";
import { UserProfile } from "../types";

interface Props {
  onComplete: (profile: UserProfile) => void;
  onBack: () => void;
}

/**
 * Profile Setup — Upload once: document for content analysis + writing sample for style.
 * 
 * Document #1 (Resume or Cover Letter):
 *   - AI analyzes for relevant experience matching target startup
 *   - Example: targeting fintech → AI extracts fintech projects/experience to lead with
 * 
 * Document #2 (Writing Sample):
 *   - AI ONLY studies writing style, habits, structure
 *   - Content is IGNORED — purely for voice matching
 */
export const ProfileSetupScreen: React.FC<Props> = ({ onComplete, onBack }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [docType, setDocType] = useState<"resume" | "cover-letter">("resume");
  const [contentDoc, setContentDoc] = useState<File | null>(null);
  const [styleDoc, setStyleDoc] = useState<File | null>(null);
  const [roles, setRoles] = useState("");
  const [industries, setIndustries] = useState("");

  const handleContentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setContentDoc(file);
  };

  const handleStyleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setStyleDoc(file);
  };

  const extractText = async (file: File): Promise<string> => {
    // Placeholder — in production, use a text extraction library or API
    return `[Extracted text from ${file.name}]`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      name,
      email,
      contentDocument: contentDoc ? {
        type: docType,
        file: contentDoc,
        text: await extractText(contentDoc),
      } : undefined,
      styleSample: styleDoc ? {
        file: styleDoc,
        text: await extractText(styleDoc),
      } : undefined,
      preferences: {
        roles: roles.split(",").map((r) => r.trim()).filter(Boolean),
        industries: industries.split(",").map((i) => i.trim()).filter(Boolean),
        locations: [],
      },
    };

    onComplete(profile);
  };

  return (
    <div className="screen-container">
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
        {/* Header */}
        <header className="flex items-center gap-3 px-8 h-14 border-b border-gray-200 bg-white shadow-sm">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-900">
            <i className="fas fa-arrow-left" />
          </button>
          <i className="fas fa-bolt text-emerald-600" />
          <span className="text-gray-900 font-bold">InternAI</span>
        </header>

        <main className="flex-1 px-8 py-8 max-w-lg mx-auto w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Upload Once</h2>
        <p className="text-sm text-gray-600 mb-8">
          Upload your documents once — AI will extract relevant experience and match your writing style.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Full Name" value={name} onChange={setName} required placeholder="Jane Doe" />
          <Field label="Email" value={email} onChange={setEmail} required placeholder="jane@university.edu" type="email" />

          <hr className="border-gray-200" />

          {/* Document #1: Content Analysis */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Document for Content Analysis <span className="text-red-600">*</span>
            </label>
            <p className="text-xs text-gray-600 mb-3">
              AI scans this for relevant experience matching your target startups.
              Example: targeting fintech → AI finds fintech projects to lead with.
            </p>
            
            {/* Resume or Cover Letter toggle */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setDocType("resume")}
                className={`flex-1 h-9 rounded-lg text-sm font-medium transition-colors ${
                  docType === "resume"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-emerald-300"
                }`}
              >
                Resume
              </button>
              <button
                type="button"
                onClick={() => setDocType("cover-letter")}
                className={`flex-1 h-9 rounded-lg text-sm font-medium transition-colors ${
                  docType === "cover-letter"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-emerald-300"
                }`}
              >
                Cover Letter
              </button>
            </div>

            <FileUpload
              label={`Upload ${docType === "resume" ? "Resume" : "Cover Letter"}`}
              file={contentDoc}
              onChange={handleContentUpload}
              accept=".pdf,.doc,.docx,.txt"
              required
            />
          </div>

          {/* Document #2: Writing Style Analysis */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Writing Sample for Style Analysis <span className="text-red-600">*</span>
            </label>
            <p className="text-xs text-gray-600 mb-3">
              AI ONLY studies your writing style, habits, and structure. Content is ignored.
              Upload any document written by you (past email, essay, blog post, etc.)
            </p>
            <FileUpload
              label="Upload Writing Sample"
              file={styleDoc}
              onChange={handleStyleUpload}
              accept=".pdf,.doc,.docx,.txt"
              required
            />
          </div>

          <hr className="border-gray-200" />

          <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Preferences</p>
          <Field
            label="Target Roles"
            value={roles}
            onChange={setRoles}
            placeholder="Frontend, Full-stack, ML Engineer"
            hint="Comma-separated"
          />
          <Field
            label="Industries"
            value={industries}
            onChange={setIndustries}
            placeholder="AI/ML, Fintech, Developer Tools"
            hint="Comma-separated"
          />

          <button
            type="submit"
            disabled={!name || !email || !contentDoc || !styleDoc}
            className="w-full h-11 rounded-xl bg-emerald-600 text-white font-semibold text-sm disabled:opacity-40 hover:bg-emerald-500 transition-colors mt-4 shadow-md"
          >
            Continue to Dashboard
          </button>
        </form>
      </main>
    </div>
    </div>
  );
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1 font-medium">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full h-10 rounded-lg px-3 text-sm bg-white border border-gray-300 text-gray-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
      {hint && <p className="text-[11px] text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function FileUpload({
  label,
  file,
  onChange,
  accept,
  required,
}: {
  label: string;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block w-full">
        <div
          className={`h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
            file
              ? "border-emerald-500 bg-emerald-50"
              : "border-gray-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/30"
          }`}
        >
          {file ? (
            <>
              <i className="fas fa-check-circle text-emerald-600 text-xl mb-1" />
              <span className="text-sm text-emerald-700 font-medium">{file.name}</span>
              <span className="text-xs text-gray-600 mt-0.5">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </>
          ) : (
            <>
              <i className="fas fa-cloud-upload-alt text-gray-400 text-2xl mb-1" />
              <span className="text-sm text-gray-700">{label}</span>
              <span className="text-xs text-gray-500 mt-0.5">
                PDF, DOC, DOCX, or TXT
              </span>
            </>
          )}
        </div>
        <input
          type="file"
          accept={accept}
          onChange={onChange}
          required={required}
          className="hidden"
        />
      </label>
    </div>
  );
}
