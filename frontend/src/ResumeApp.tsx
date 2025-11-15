import React, { useState } from "react";
import Template1 from "./templates/template1";
import Template2 from "./templates/template2";
import Template3 from "./templates/template3";

const templates = [
  { id: 1, name: "Modern Minimal", component: Template1 },
  { id: 2, name: "Professional Blue", component: Template2 },
  { id: 3, name: "Elegant Two-Column", component: Template3 },
];

export default function ResumeApp() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [enhanced, setEnhanced] = useState("");
  const [original, setOriginal] = useState("");
  const [structured, setStructured] = useState<any>(null);
  const [ats, setAts] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(1);

const uploadFile = async () => {
  if (!file) return alert("Please upload a resume first!");
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("resume_file", file);

    const res = await fetch("http://localhost:5000/enhance", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      alert("Enhancement failed");
      return;
    }

    // Receive PDF as blob
    const blob = await res.blob();

    // Download automatically
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "enhanced_resume.pdf";
    a.click();
    URL.revokeObjectURL(url);

    // Optional: show something in preview
    setEnhanced("Enhanced PDF downloaded successfully.");
  } catch (e) {
    alert("Failed to contact backend");
    console.error(e);
  } finally {
    setLoading(false);
  }
};

  const exportPDF = async () => {
    if (!structured) return alert("No structured data to export");
    const res = await fetch("http://localhost:5000/export/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(structured)
    });
    const data = await res.json();
    if (data.file) {
      window.open("http://localhost:5000/download/" + data.file, "_blank");
    } else {
      alert("Failed to export PDF. Check backend.");
    }
  };

  const exportDOCX = async () => {
    if (!structured) return alert("No structured data to export");
    const res = await fetch("http://localhost:5000/export/docx", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(structured)
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.docx";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const err = await res.json();
      alert("Export failed: " + (err.error || "unknown"));
    }
  };

  const resumeData = structured || {
    name: "Your Name",
    job_title: "Job Title",
    summary: enhanced || "Enhanced summary will appear here",
    skills: ["Skill A", "Skill B"],
    experience: [{ position: "Role", company: "Company", years: "2021-2024", description: "Description" }]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Resume Builder Pro</h1>
            <p className="text-sm text-gray-500">Upload → Enhance → Template → Export</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-blue-600 text-white rounded">Templates</button>
            <button className="px-3 py-2 border rounded" onClick={exportPDF}>Export PDF</button>
            <button className="px-3 py-2 border rounded" onClick={exportDOCX}>Export DOCX</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 border-2 border-dashed rounded text-center">
              <input id="file" type="file" className="hidden" onChange={(e)=> setFile(e.target.files?.[0] ?? null)} />
              <label htmlFor="file" className="cursor-pointer block">Click or drag to upload</label>
              {file && <div className="mt-2 text-sm text-blue-600">{file.name}</div>}
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-semibold mb-2">Enhanced Text</h3>
              <pre className="text-sm">{enhanced || "No enhanced text yet"}</pre>
            </div>

            <div className="flex gap-3">
              <button onClick={uploadFile} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading ? "Enhancing..." : "Enhance Resume"}</button>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="p-4 bg-white rounded shadow">
              <h4 className="font-semibold">ATS Score</h4>
              <div className="mt-2 text-sm">{ats ? ats.overall_score + "% overall" : "No analysis yet"}</div>
            </div>

            <div className="p-4 bg-white rounded shadow">
              <h4 className="font-semibold">Choose Template</h4>
              <div className="mt-3 flex flex-col gap-2">
                {templates.map(t => (
                  <button key={t.id} onClick={()=> setSelectedTemplate(t.id)} className={selectedTemplate===t.id ? "bg-blue-600 text-white px-3 py-1 rounded":"px-3 py-1 border rounded"}>{t.name}</button>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Template Preview</h3>
          <div className="border rounded p-4 bg-white">
            {React.createElement(templates[selectedTemplate-1].component, {data: resumeData})}
          </div>
        </div>
      </div>
    </div>
  );
}
