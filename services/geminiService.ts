
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Language } from "../types";

export const analyzeContent = async (
  mode: 'image' | 'text',
  content: string, // Base64 for image, raw string for text
  mimeType: string, // 'image/png' etc for image, 'text/plain' for text
  language: Language,
  context: 'general' | 'delivery' = 'general'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  let systemInstruction = `
    You are "Saif-AI," an elite Cyber Defense Agent for the UAE. 
    Your strict purpose is to detect phishing, scams, and malicious intent targeting UAE residents.
    You are concise, professional, and authoritative.
  `;

  if (context === 'delivery') {
    systemInstruction += `
      SPECIAL FOCUS: DETECT FAKE DELIVERY SCAMS.
      Look for: Fake Emirates Post, Aramex, DHL messages.
      Keywords: "Delivery suspended", "Address update", "Small fee", "Warehouse", "Customs fee".
      Check URLs carefully for typos (e.g. emirates-post.net instead of emiratespost.ae).
    `;
  }

  const prompt = `
    **TASK:** Analyze this ${mode} for cyber threats.
    **CONTEXT:** ${context.toUpperCase()} SCAN.
    **USER LANGUAGE:** ${language} (Output everything in this language)
    
    **INPUT CONTENT:**
    ${mode === 'text' ? `"${content}"` : '(Image attached)'}

    **REQUIRED OUTPUT FORMAT (JSON ONLY):**
    You must output a raw JSON object. Do not wrap in markdown code blocks.
    
    Structure:
    {
      "verdict": "SCAM" | "SAFE" | "UNKNOWN",
      "risk_score": 1-100,
      "short_sms_draft": "Write a VERY SHORT (under 140 chars) report for Al Ameen (8004888). Example: 'Suspected Scam: [Type] from [Number/Sender]. Content: [Brief Content].'",
      "detailed_analysis": [
        "Bullet point 1 explaining the threat technicality",
        "Bullet point 2 pointing out specific red flags (e.g. bad grammar, fake URL, urgent tone)"
      ],
      "evidence_extracted": {
        "phone_numbers": ["..."],
        "urls": ["..."],
        "keywords": ["..."]
      }
    }
  `;

  let userContent: any[] = [{ text: prompt }];

  if (mode === 'image') {
    userContent.push({
      inlineData: {
        mimeType: mimeType,
        data: content,
      },
    });
  }

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json"
    },
    contents: { parts: userContent },
  });

  return response.text || "{}";
};
