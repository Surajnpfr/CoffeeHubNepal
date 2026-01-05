import { GEMINI_MODEL } from '@/utils/constants';

export const callGemini = async (userQuery: string, systemPrompt: string = ""): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] }
  };

  const fetchWithRetry = async (retries = 5, delay = 1000): Promise<any> => {
    try {
      const response = await fetch(url, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      if (retries > 0) {
        await new Promise(r => setTimeout(r, delay));
        return fetchWithRetry(retries - 1, delay * 2);
      }
      throw error;
    }
  };

  try {
    const result = await fetchWithRetry();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
  } catch {
    return "AI Assistant is busy. Please try again.";
  }
};

