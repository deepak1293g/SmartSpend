
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeExpenses = async (transactions: Transaction[]) => {
  if (transactions.length === 0) return "Add some transactions to get AI insights!";

  const summary = transactions.map(t => ({
    type: t.type,
    amount: t.amount,
    category: t.category,
    date: t.date,
    description: t.description
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional financial advisor. Analyze the following user transactions and provide 3 actionable, concise bullet points to help them save money or manage their budget better. Keep it encouraging and futuristic.
      
      Transactions: ${JSON.stringify(summary)}`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "I couldn't generate insights at this moment. Try adding more transactions!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI financial advisor is currently offline. Check back later.";
  }
};
