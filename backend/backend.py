import os
import logging
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
import json

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("resume-backend")

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")


if not API_KEY:
    raise Exception("❌ No Gemini API key found in .env!")

client = genai.Client(api_key=API_KEY)
log.info("Gemini client initialized.")
log.info(f"Gemini API key present. Default model: {MODEL}")

app = Flask(__name__)
CORS(app)


def enhance_with_gemini(text: str) -> str:
    prompt = f"""
Enhance the following resume text. 
- Improve grammar 
- Rewrite into strong ATS-optimized bullets 
- Use measurable achievements 
- Improve tone 
- Output ONLY improved resume text.

Resume:
{text}
"""

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )
    return response.text


def ats_analysis(text: str):
    return {
        "overall_score": 78,
        "keyword_score": 71,
        "skill_match_score": 69,
        "formatting_issues": ["Long paragraphs", "Lack of bullet points"],
        "grammar_issues": ["Missing commas", "Weak verbs"],
        "missing_hard_skills": ["Docker", "Kubernetes"],
        "missing_soft_skills": ["Leadership"],
        "recommendations": [
            "Add quantifiable achievements",
            "Use stronger action verbs",
            "Shorten sentences for readability"
        ]
    }


def extract_resume_structure(text: str):
    return {
        "name": "Your Name",
        "job_title": "Job Title",
        "summary": text[:300],
        "skills": ["Python", "React", "Node.js"],
        "experience": [
            {
                "position": "Software Developer",
                "company": "Tech Corp",
                "years": "2021-2024",
                "description": "Developed backend services and APIs."
            }
        ]
    }


@app.route("/enhance", methods=["POST"])
def enhance_resume():
    print("📥 /enhance called")

    file = request.files.get("resume_file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    raw = file.read().decode("utf-8", errors="ignore")
    print(f"📄 Raw file length: {len(raw)}")

    try:
        enhanced = enhance_with_gemini(raw)
        structured = extract_resume_structure(enhanced)
        ats = ats_analysis(raw)

        return jsonify({
            "original_text": raw,
            "enhanced_text": enhanced,
            "structured": structured,
            "ats": ats
        })

    except Exception as e:
        print("🔥 ERROR in /enhance:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/export/pdf", methods=["POST"])
def export_pdf():
    data = request.json
    html = f"""
    <html><body>
        <h1>{data.get('name')}</h1>
        <h2>{data.get('job_title')}</h2>
        <p>{data.get('summary')}</p>

        <h3>Skills</h3>
        <ul>{"".join(f"<li>{s}</li>" for s in data.get("skills", []))}</ul>

        <h3>Experience</h3>
        {''.join(f"<p><b>{x['position']}</b> — {x['company']} ({x['years']})<br>{x['description']}</p>" for x in data.get("experience", []))}
    </body></html>
    """

    filename = "resume_export.html"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(html)

    return jsonify({"file": filename})


@app.route("/export/docx", methods=["POST"])
def export_docx():
    try:
        from docx import Document
        data = request.json

        doc = Document()
        doc.add_heading(data.get("name"), level=0)
        doc.add_heading(data.get("job_title"), level=1)

        doc.add_heading("Summary", level=2)
        doc.add_paragraph(data.get("summary"))

        doc.add_heading("Skills", level=2)
        for s in data.get("skills", []):
            doc.add_paragraph(s, style="List Bullet")

        doc.add_heading("Experience", level=2)
        for exp in data.get("experience", []):
            doc.add_paragraph(
                f"{exp['position']} — {exp['company']} ({exp['years']})",
                style="List Bullet"
            )
            doc.add_paragraph(exp["description"])

        filename = "resume.docx"
        doc.save(filename)

        return send_file(filename, as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/download/<path:filename>")
def download(filename):
    if os.path.exists(filename):
        return send_file(filename, as_attachment=True)
    return jsonify({"error": "File not found"}), 404


if __name__ == "__main__":
    log.info("Starting Resume backend...")
    app.run(host="0.0.0.0", port=5000, debug=True)
