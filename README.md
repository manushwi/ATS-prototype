AI-Powered ATS (Applicant Tracking System)
==========================================

An intelligent recruitment platform that automates resume screening using Google Gemini AI, providing instant candidate scoring and keyword analysis.

🎯 Overview
-----------

This ATS system streamlines the hiring process by automatically analyzing candidate resumes against job descriptions, calculating compatibility scores, and identifying missing skills—all powered by AI.

🏗️ Architecture & Tech Stack
-----------------------------

### Frontend

*   **React** with TypeScript
    
*   **Context API** for state management
    
*   **LocalStorage** for data persistence
    
*   **Tailwind CSS** for styling
    

### AI Service

*   **Google Gemini 2.5 Flash API**
    
*   Multimodal input support (text + PDF)
    
*   Structured JSON output via response schemas
    

### File Processing

*   **FileReader API** for PDF handling
    
*   **Base64 encoding** for file transmission
    
*   Native OCR/text extraction by Gemini
    

📋 System Flow
--------------

### Step 1: Job Creation (HR)

*   HR creates a job posting
    
*   Job details saved to localStorage
    
*   Available for candidate applications
    

### Step 2: Application & PDF Upload (Candidate)

*   Candidate selects a job from available positions
    
*   Uploads resume as PDF
    
*   File processed through FileReader API
    

### Step 3: AI Analysis (Gemini)

*   Gemini reads text content from PDF (native OCR)
    
*   Compares resume content against job description
    
*   Calculates compatibility score (0-100)
    
*   Identifies missing keywords/skills
    

### Step 4: Scoring Logic & Storage

*   Application receives structured JSON data
    
*   **Auto-screening logic:**
    

javascript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML  `if (score > 75) {      status = "Shortlisted"    } else {      status = "Auto-Rejected"    }`

*   Application data saved to localStorage
    
*   **Note:** PDF files are NOT saved to storage to prevent 5MB limit issues
    

### Step 5: Review & Assessment (HR)

*   HR views dashboard with all applications
    
*   Candidates sorted by score (highest first)
    
*   Transparent scoring with missing skills displayed
    
*   Clear insights: "Missing: TypeScript, AWS"
    

🔧 Technical Implementation
---------------------------

### PDF Processing Pipeline

#### The Challenge

*   Browsers cannot access local file paths (security)
    
*   Gemini API requires specific data format
    

#### The Solution: Base64 Encoding

**Step 1: File Selection**

javascript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`  `

**Step 2: Reading Binary Data**

javascript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   const reader = new FileReader();  reader.readAsDataURL(file);   `

**Step 3: Format Extraction**

javascript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   // Problem: Full data URL  "data:application/pdf;base64,JVBERi0xLjQK..."  // Solution: Extract pure Base64  const base64 = dataUrl.split(',')[1];  // Result: "JVBERi0xLjQK..."   `

### AI Integration

#### Request Structure (Multimodal)

javascript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    model: "gemini-2.5-flash",    contents: [      {        parts: [          {            inlineData: {              mimeType: "application/pdf",              data: pdfBase64            }          },          {            text: jobDescription          }        ]      }    ],    generationConfig: {      responseMimeType: "application/json",      responseSchema: {        type: "object",        properties: {          score: { type: "number" },          missingKeywords: {             type: "array",            items: { type: "string" }          }        }      }    }  }   `

#### Why JSON Schema?

*   **Consistency:** AI cannot "improvise" the format
    
*   **Type Safety:** TypeScript interfaces align with API contract
    
*   **Parsing:** Direct JSON.parse() without text extraction
    
*   **UI Mapping:** Data structure matches component needs
    

💾 State Persistence Strategy
-----------------------------

### Why LocalStorage?

*   ✅ Survives page refreshes
    
*   ✅ No backend required
    
*   ✅ Immediate availability
    
*   ✅ Session continuity
    
*   ✅ Simple implementation
    

### Storage Structure

javascript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    jobs: [{ id, title, description, ... }],    applications: [{       id,       jobId,       candidateName,       score,       missingKeywords,       status,      pdfUrl // Blob URL, not Base64    }]  }   `

🚀 Advanced Features
--------------------

### File Upload Validation

javascript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   // Validate file type  if (file.type !== 'application/pdf') {    alert('Please upload a PDF file');    return;  }  // Validate file size (max 10MB)  if (file.size > 10 * 1024 * 1024) {    alert('File size must be less than 10MB');    return;  }   `

### Automatic Status Assignment

*   **Score > 75:** ✅ Shortlisted
    
*   **Score ≤ 75:** ❌ Auto-Rejected
    

### Smart Dashboard Sorting

*   Candidates automatically sorted by score
    
*   Highest scores appear first
    
*   Clear visual indicators for status
    

🔍 Data Flow Diagram
--------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   [User Uploads PDF]       ↓  [FileReader → Base64]      ↓  [Gemini API Analysis]      ↓  [JSON Response: score + missingKeywords]      ↓  [Auto-screening Logic]      ↓  [LocalStorage Save]      ↓  [HR Dashboard Display]   `

🐛 Common Issues & Solutions
----------------------------

### 1\. PDF Not Displaying in Dashboard

**Cause:** Blob URL not created correctly**Fix:** Ensure URL.createObjectURL() receives File object, not Base64

javascript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   const blobUrl = URL.createObjectURL(file);   `

### 2\. API Returns Text Instead of JSON

**Cause:** responseSchema not properly configured**Fix:** Verify responseMimeType: "application/json" is set

javascript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   generationConfig: {    responseMimeType: "application/json",    responseSchema: { ... }  }   `

### 3\. Base64 String Invalid

**Cause:** Data URL prefix not removed**Fix:** Apply .split(',')\[1\] to extract pure Base64

javascript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   const base64 = dataUrl.split(',')[1]; // Remove "data:application/pdf;base64,"   `

### 4\. LocalStorage Quota Exceeded

**Cause:** Storing large Base64 PDFs**Fix:** Store Blob URLs instead of Base64 strings

🎨 Future Enhancements
----------------------

*    Migrate to **Gemini Pro** for enhanced accuracy
    
*    Add resume parsing for **DOC/DOCX** formats
    
*    Implement **bulk upload** functionality
    
*    Add **email notifications** for candidates
    
*    Create **analytics dashboard** for recruitment metrics
    
*    Support for **multiple languages**
    
*    **Export** functionality (CSV/Excel)
    
*    **Interview scheduling** integration
    

📦 Installation & Setup
-----------------------

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Clone the repository  git clone   # Install dependencies  npm install  # Add your Gemini API key  # Create .env file and add:  VITE_GEMINI_API_KEY=your_api_key_here  # Start development server  npm run dev   `

🔑 Environment Variables
------------------------

env

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   VITE_GEMINI_API_KEY=your_gemini_api_key   `

📄 License
----------

MIT License

🤝 Contributing
---------------

Contributions are welcome! Please feel free to submit a Pull Request.

📧 Support
----------

For issues or questions, please open an issue in the repository.