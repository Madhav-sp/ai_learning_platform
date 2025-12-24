"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Loader2 } from "lucide-react";

export default function UploadNotebookPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // 1️⃣ Upload PDF
      const formData = new FormData();
      formData.append("pdf", file);

      const pdfRes = await fetch("/api/pdf/upload", {
        method: "POST",
        body: formData,
      });

      const pdfData = await pdfRes.json();

      // 2️⃣ Analyze text
      const analyzeRes = await fetch("/api/pdf/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pdfData.text }),
      });

      const analyzed = await analyzeRes.json();

      // 3️⃣ Save notebook
      await fetch("/api/notebook/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.name.replace(".pdf", ""),
          ...analyzed.data,
        }),
      });

      // 4️⃣ Go back to library
      router.push("/notebook");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-gray-300 flex items-center justify-center">
      <div className="max-w-xl w-full bg-[#111113] border border-white/5 rounded-3xl p-10">
        {!loading ? (
          <>
            <h1 className="text-2xl font-bold text-white mb-6">Upload PDF</h1>

            <label className="flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl p-12 cursor-pointer hover:border-orange-500/40 transition-all">
              <Upload className="w-10 h-10 text-orange-500 mb-4" />
              <span className="text-sm text-gray-400">Click to upload PDF</span>
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>

            {file && (
              <div className="flex items-center gap-2 mt-4 text-sm">
                <FileText size={16} className="text-orange-500" />
                {file.name}
              </div>
            )}

            <button
              onClick={handleUpload}
              className="mt-8 w-full bg-orange-500 hover:bg-orange-600 text-black py-3 rounded-xl font-semibold"
            >
              Create Notebook
            </button>
          </>
        ) : (
          <LoadingSkeleton />
        )}
      </div>
    </div>
  );
}
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-3">
        <Loader2 className="animate-spin text-orange-500" />
        <p className="text-sm text-gray-400">Analyzing your document…</p>
      </div>

      <div className="h-6 bg-white/10 rounded w-1/3" />
      <div className="h-24 bg-white/5 rounded-2xl" />

      <div className="h-6 bg-white/10 rounded w-1/4" />
      <div className="h-32 bg-white/5 rounded-2xl" />

      <div className="h-6 bg-white/10 rounded w-1/5" />
      <div className="grid grid-cols-1 gap-3">
        <div className="h-20 bg-white/5 rounded-2xl" />
        <div className="h-20 bg-white/5 rounded-2xl" />
      </div>
    </div>
  );
}
