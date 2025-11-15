# AI-Powered Resume Builder & ATS Optimizer

A full-stack web application that leverages AI to help users create, enhance, and optimize resumes for better ATS (Applicant Tracking System) compatibility. Built with Flask backend and React frontend, featuring real-time AI enhancements, live previews, and professional export options.

## Features

- **AI Resume Enhancement**: Uses OpenAI GPT-4 to improve grammar, rewrite content into ATS-optimized bullet points, and enhance overall tone
- **ATS Scoring & Analysis**: Integrates with external ATS APIs to provide detailed scoring and recommendations
- **Dual Input Methods**: Support for file uploads (PDF/TXT) and manual form-based entry
- **Live Preview**: Real-time resume previews with multiple template options
- **Comparison Mode**: Side-by-side view of original vs. enhanced text
- **Professional Exports**: Generate PDFs using LaTeX templates and DOCX files
- **AI Feedback Chat**: Interactive chat interface for resume improvement suggestions
- **Score Tracking**: Monitor ATS score improvements over time
- **Multiple Templates**: Choose from Modern Minimal, Professional Blue, and Two-Column layouts

## System Architecture

### Backend (Flask)
- **AI Integration**: OpenAI for text enhancement, Google Gemini as fallback
- **ATS Analysis**: External API integration for scoring and feedback
- **Document Generation**: LaTeX compilation for PDFs, python-docx for Word documents
- **API Endpoints**:
  - `POST /enhance`: Process uploaded resume files
  - `POST /manual-entry`: Handle form-based resume creation
  - `POST /export/pdf`: Generate PDF exports
  - `POST /export/docx`: Generate DOCX exports
  - `POST /ats-score`: Get ATS analysis
  - `POST /feedback-chat`: AI-powered feedback chat
  - `GET /score-tracker`: Retrieve score history

### Frontend (React + Vite)
- **UI Framework**: React with TypeScript and Tailwind CSS
- **Form Management**: react-hook-form for dynamic form handling
- **Live Preview**: React components for template rendering
- **Interactive Features**: Split-pane comparison, chat widget, template selection

## System Flow

### 1. User Input
Users can either upload existing resume files or manually enter information through intuitive forms covering personal details, skills, and work experience.

### 2. AI Processing
- **Text Enhancement**: AI analyzes and improves resume content for clarity and impact
- **Structure Extraction**: Content is parsed into structured JSON format
- **ATS Optimization**: Keywords and formatting are optimized for ATS systems

### 3. Analysis & Feedback
- **ATS Scoring**: Resume is scored against ATS compatibility metrics
- **Recommendations**: Detailed feedback on improvements needed
- **Interactive Chat**: Users can ask AI for specific suggestions

### 4. Preview & Export
- **Live Preview**: See changes in real-time with chosen templates
- **Export Options**: Download professional PDFs or editable DOCX files

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- pdflatex (for PDF generation)
- API keys for OpenAI and ATS service

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
npm install
```

## Configuration

Create a `.env` file in the backend directory with the following variables:
```
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
ATS_API_KEY=your_ats_api_key
GEMINI_MODEL=gemini-1.5-flash
```

## Running the Application

### Backend
```bash
cd backend
python backend.py
```
Server runs on http://localhost:5000

### Frontend
```bash
cd frontend
npm run dev
```
Application runs on http://localhost:5173

## Usage

1. **File Upload**: Click "Upload Resume" and select your resume file
2. **Manual Entry**: Toggle "Manual Entry" mode and fill in the forms
3. **Enhance**: Click "Enhance Resume" to apply AI improvements
4. **Review**: Check ATS scores and recommendations in the sidebar
5. **Preview**: Select templates and view live preview
6. **Export**: Choose PDF or DOCX export with your preferred template

## Templates

- **Modern Minimal**: Clean, minimalist design with centered header
- **Professional Blue**: Corporate style with blue accents
- **Two-Column**: Space-efficient layout with skills and experience side-by-side

## API Reference

### POST /enhance
Upload a resume file for AI enhancement.

**Request**: FormData with `resume_file`

**Response**:
```json
{
  "original_text": "...",
  "enhanced_text": "...",
  "structured": {...},
  "ats": {...}
}
```

### POST /export/pdf
Generate PDF from structured resume data.

**Request**: JSON with resume data and template selection

**Response**: PDF file download

## Technologies Used

- **Backend**: Flask, OpenAI API, Google Generative AI, LaTeX, python-docx
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **AI/ML**: OpenAI GPT-4, External ATS APIs
- **Document Processing**: pylatex, reportlab, python-docx



For issues or questions, please open an issue on GitHub or contact the development team.
