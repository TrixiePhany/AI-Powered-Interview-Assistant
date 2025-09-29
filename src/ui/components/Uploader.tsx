import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { parseResume } from "../../features/resume/parse";
import CandidateInfoModal from "./CandidateInfoModal";
import { motion } from "framer-motion";

export default function Uploader() {
  const [err, setErr] = useState<string | undefined>();
  const [parsed, setParsed] = useState<any | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        setErr("Unsupported file type. Please upload a PDF or DOCX file.");
        return;
    }

    setIsLoading(true);
    setErr(undefined);
    setSelectedFileName(file.name);

    try {
      const res = await parseResume(file);
      setParsed(res.candidate);
      setErr(undefined);
    } catch (ex: any) {
      setErr(ex.message || "Failed to parse resume");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <>
      <div
        className={`flex flex-col items-center justify-center bg-gray-800 rounded-xl shadow-lg w-[40vw] h-[35vh] max-w-2xl mx-auto my-12 transition-colors duration-200
          ${isDragging ? "border-2 border-dashed border-indigo-500" : "border border-gray-700"}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
        <p className="mt-4 text-sm text-gray-400">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-indigo-400 hover:underline"
          >
            Click to upload
          </button>{" "}
          or drag and drop
        </p>
        <p className="mt-1 text-xs text-gray-500">PDF, DOCX (Max 10MB)</p>
        {selectedFileName && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-300 bg-gray-700 p-2 rounded-lg">
                <span className="truncate">{selectedFileName}</span>
                {isLoading && (
                    <motion.div
                        className="w-4 h-4 border-2 border-gray-500 border-t-indigo-500 rounded-full animate-spin"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ ease: "linear", duration: 1, repeat: Infinity }}
                    />
                )}
            </div>
        )}
        {err && <p className="text-red-400 text-sm mt-4">{err}</p>}
      </div>

      {parsed && (
        <CandidateInfoModal initial={parsed} onClose={() => setParsed(null)} />
      )}
    </>
  );
}
