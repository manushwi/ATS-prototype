
import { GoogleGenAI, Type } from "@google/genai";
import { ATSAnalysis } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeResumeWithGemini = async (
  jobDescription: string,
  jobRequirements: string,
  resumeBase64: string,
  mimeType: string = "application/pdf"
): Promise<ATSAnalysis> => {
  try {
    const prompt = `
      You are an expert Application Tracking System (ATS) and HR Recruiter.
      
      Your task is to evaluate the candidate's attached resume (PDF) against the specific job description and requirements provided below.
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      JOB REQUIREMENTS:
      ${jobRequirements}
      
      Analyze the resume content strictly. 
      1. Assign a score from 0 to 100 based on keyword matching, experience relevance, and skills.
      2. Identify key missing skills or keywords that are present in the requirements but missing in the resume.
      3. Identify the top strengths of the candidate.
      4. Provide a brief 2-sentence summary of the candidate's fit.
      
      Return the result strictly as JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
            { text: prompt },
            { inlineData: { mimeType: mimeType, data: resumeBase64 } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Score from 0 to 100" },
            missingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of important keywords missing from resume"
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of candidate strengths"
            },
            summary: { type: Type.STRING, description: "Brief summary of fit" }
          },
          required: ["score", "missingKeywords", "strengths", "summary"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from Gemini");
    }

    const analysis: ATSAnalysis = JSON.parse(resultText);
    return analysis;

  } catch (error) {
    console.error("Error analyzing resume:", error);
    // Fallback mock response in case of API failure to prevent app crash during demo
    return {
      score: 0,
      missingKeywords: ["Error analyzing resume"],
      strengths: [],
      summary: "Failed to analyze resume due to API error."
    };
  }
};

export const generateAssessment = async (jobTitle: string, missingKeywords: string[]): Promise<string> => {
    try {
        const prompt = `
            Generate a short technical assessment email for a candidate applying for the position of ${jobTitle}.
            The candidate was missing the following keywords: ${missingKeywords.join(', ')}.
            
            The email should be professional, inviting them to a coding challenge or quiz specifically targeting these missing areas to verify their knowledge.
            Keep it under 100 words.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        return response.text || "Draft assessment could not be generated.";
    } catch (e) {
        return "Error generating assessment.";
    }
}
