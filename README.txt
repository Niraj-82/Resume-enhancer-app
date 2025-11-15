COMBINED PROJECT - Resume Builder (Frontend + Backend)

Structure:
- backend/: Flask backend with endpoints:
    POST /enhance       -> accepts resume_file form upload, returns enhanced text, structured JSON, and ATS report
    POST /export/pdf    -> accepts structured JSON, returns an HTML file path (pdf generation optional)
    POST /export/docx   -> accepts structured JSON, returns a downloadable .docx if python-docx is installed
    GET  /download/<file> -> download generated files

- frontend/: Vite + React + Tailwind UI (premium)
    - src/: App.tsx, ResumeApp.tsx (main UI), templates/ (3 templates)
    - run: npm install && npm run dev

How to run backend:
1. cd backend
2. python -m venv venv
3. venv\Scripts\activate   (Windows)
4. pip install -r requirements.txt
5. python backend.py
Note: For Gemini integration, install google-generativeai and set GEMINI_API_KEY in .env

How to run frontend:
1. cd frontend
2. npm install
3. npm run dev
Open http://localhost:5173

Notes:
- This package includes placeholder Gemini logic. Replace placeholders with real gemini calls if you have access.
- PDF export uses pdfkit and wkhtmltopdf if available. Fallback saves HTML.
