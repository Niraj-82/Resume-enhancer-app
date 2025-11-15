import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Template1 from "./templates/template1";
import Template2 from "./templates/template2";
import Template3 from "./templates/template3";
import SplitPane from "react-split-pane";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";

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
  const [manualMode, setManualMode] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<any[]>([]);

  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      name: "",
      job_title: "",
      summary: "",
      skills: [{ value: "" }],
      experience: [{ position: "", company: "", years: "", description: "" }]
    }
  });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: "skills" });
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: "experience" });

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

    const data = await res.json();
    setOriginal(data.original_text);
    setEnhanced(data.enhanced_text);
    setStructured(data.structured);
    setAts(data.ats);
  } catch (e) {
    alert("Failed to contact backend");
    console.error(e);
  } finally {
    setLoading(false);
  }
};

const onManualSubmit = async (data: any) => {
  setLoading(true);
  try {
    const res = await fetch("http://localhost:5000/manual-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    setEnhanced(result.enhanced_text);
    setStructured(result.structured);
    setAts(result.ats);
  } catch (e) {
    alert("Failed to process manual entry");
    console.error(e);
  } finally {
    setLoading(false);
  }
};

const handleChat = async (newMessage: string) => {
  try {
    const res = await fetch("http://localhost:5000/feedback-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: newMessage }),
    });
    const data = await res.json();
    addResponseMessage(data.response);
  } catch (e) {
    addResponseMessage("Sorry, I couldn't process that.");
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

  const watchedData = watch();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">AI-Powered Resume Builder & ATS Optimizer</h1>
            <p className="text-sm text-gray-500">Manual Entry | AI Enhancement | ATS Scoring | Live Preview</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setManualMode(!manualMode)} className="px-3 py-2 bg-blue-600 text-white rounded">Manual Entry</button>
            <button onClick={() => setComparisonMode(!comparisonMode)} className="px-3 py-2 border rounded">Comparison Mode</button>
            <button className="px-3 py-2 border rounded" onClick={exportPDF}>Export PDF</button>
            <button className="px-3 py-2 border rounded" onClick={exportDOCX}>Export DOCX</button>
          </div>
        </header>

        {manualMode ? (
          <form onSubmit={handleSubmit(onManualSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input {...register("name")} placeholder="Name" className="p-2 border rounded" />
              <input {...register("job_title")} placeholder="Job Title" className="p-2 border rounded" />
            </div>
            <textarea {...register("summary")} placeholder="Summary" className="w-full p-2 border rounded" rows={3} />
            <div>
              <h4>Skills</h4>
              {skillFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2">
                  <input {...register(`skills.${index}.value`)} placeholder="Skill" className="p-2 border rounded flex-1" />
                  <button type="button" onClick={() => removeSkill(index)} className="px-2 py-1 bg-red-500 text-white rounded">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => appendSkill({ value: "" })} className="px-3 py-1 bg-green-500 text-white rounded">Add Skill</button>
            </div>
            <div>
              <h4>Experience</h4>
              {expFields.map((field, index) => (
                <div key={field.id} className="border p-4 mb-4 rounded">
                  <input {...register(`experience.${index}.position`)} placeholder="Position" className="p-2 border rounded w-full mb-2" />
                  <input {...register(`experience.${index}.company`)} placeholder="Company" className="p-2 border rounded w-full mb-2" />
                  <input {...register(`experience.${index}.years`)} placeholder="Years" className="p-2 border rounded w-full mb-2" />
                  <textarea {...register(`experience.${index}.description`)} placeholder="Description" className="p-2 border rounded w-full" rows={3} />
                  <button type="button" onClick={() => removeExp(index)} className="mt-2 px-2 py-1 bg-red-500 text-white rounded">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => appendExp({ position: "", company: "", years: "", description: "" })} className="px-3 py-1 bg-green-500 text-white rounded">Add Experience</button>
            </div>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading ? "Processing..." : "Enhance & Analyze"}</button>
          </form>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="p-4 border-2 border-dashed rounded text-center">
                <input id="file" type="file" className="hidden" onChange={(e)=> setFile(e.target.files?.[0] ?? null)} />
                <label htmlFor="file" className="cursor-pointer block">Click or drag to upload</label>
                {file && <div className="mt-2 text-sm text-blue-600">{file.name}</div>}
              </div>

              {comparisonMode ? (
                <SplitPane split="vertical" defaultSize="50%">
                  <div className="p-4 bg-gray-50 rounded">
                    <h3 className="font-semibold mb-2">Original</h3>
                    <pre className="text-sm">{original || "No original text"}</pre>
                  </div>
                  <div className="p-4 bg-gray-50 rounded">
                    <h3 className="font-semibold mb-2">Enhanced</h3>
                    <pre className="text-sm">{enhanced || "No enhanced text"}</pre>
                  </div>
                </SplitPane>
              ) : (
                <div className="p-4 bg-gray-50 rounded">
                  <h3 className="font-semibold mb-2">Enhanced Text</h3>
                  <pre className="text-sm">{enhanced || "No enhanced text yet"}</pre>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={uploadFile} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading ? "Enhancing..." : "Enhance Resume"}</button>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="p-4 bg-white rounded shadow">
                <h4 className="font-semibold">ATS Score</h4>
                <div className="mt-2 text-sm">{ats ? ats.overall_score + "% overall" : "No analysis yet"}</div>
                {ats && <div className="text-xs text-gray-500">Keyword: {ats.keyword_score}%, Skills: {ats.skill_match_score}%</div>}
              </div>

              <div className="p-4 bg-white rounded shadow">
                <h4 className="font-semibold">Score Tracker</h4>
                <div className="mt-2 text-sm">
                  {scoreHistory.map((entry, idx) => <div key={idx}>{entry.date}: {entry.score}%</div>)}
                </div>
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
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Live Preview</h3>
          <div className="border rounded p-4 bg-white">
            {React.createElement(templates[selectedTemplate-1].component, {data: manualMode ? watchedData : resumeData})}
          </div>
        </div>
      </div>
      <Widget handleNewUserMessage={handleChat} title="Feedback Chat" subtitle="Get AI suggestions" />
    </div>
  );
}
