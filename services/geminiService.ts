
import { GoogleGenAI } from "@google/genai";
import { SCENARIO_KEYWORDS, generateScenarioData } from '../data/scenarios';
import { Task, QuoteItem } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// This simulates the "Brain" of the app. 
export const processUserRequest = async (input: string): Promise<Partial<Task>> => {
  // 1. Local Keyword Matching (Faster/Cheaper than API for MVP)
  let matchedKey = 'GENERAL';
  for (const [key, val] of Object.entries(SCENARIO_KEYWORDS)) {
      if (input.includes(key)) {
          matchedKey = val;
          break;
      }
  }

  // 2. Generate Data based on Scenario
  const { modes, steps, category } = generateScenarioData(matchedKey);

  // 3. Use Gemini for a "Human-like" analysis message (The "Assistant" voice)
  let aiMessage = "收到。正在為您分析需求...";
  if (apiKey) {
      try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `User request: "${input}". 
            Matched Scenario: ${matchedKey}. 
            Context: Hong Kong Service App (Uber+Airbnb style).
            Response: Acknowledge the problem, be empathetic, and concisely explain the next step (Mode Selection). 
            Example: "水管爆裂好麻煩！我已經為你找到附近的師傅和緊急維修方案，請選擇你需要的服務模式。"
            Keep it under 30 words. Cantonese.`,
        });
        aiMessage = response.text || aiMessage;
      } catch (e) {
        console.warn("AI Generation failed, using fallback");
        aiMessage = `明白，這是關於${category}的請求。請選擇服務模式。`;
      }
  }

  return {
      description: input,
      category,
      aiAnalysis: aiMessage,
      recommendedModes: modes,
      steps: steps,
  };
};

export const generateQuote = async (task: Task, providerName: string): Promise<any> => {
    // Mock quote generation based on category
    const items = [];
    if (task.category === 'HOME_REPAIR') {
        items.push({ id: 'q1', description: '上門檢查費', quantity: 1, unitPrice: 200, category: 'FEE' });
        items.push({ id: 'q2', description: '維修人工', quantity: 1, unitPrice: 600, category: 'LABOR' });
        items.push({ id: 'q3', description: '止水膠帶/零件', quantity: 1, unitPrice: 150, category: 'MATERIAL' });
    } else if (task.category === 'SOCIAL') {
        items.push({ id: 'q1', description: '陪伴服務費 (小時)', quantity: 2, unitPrice: 150, category: 'LABOR' });
        items.push({ id: 'q2', description: '平台安全費', quantity: 1, unitPrice: 20, category: 'INSURANCE' });
    } else {
        items.push({ id: 'q1', description: '基本服務費', quantity: 1, unitPrice: 100, category: 'LABOR' });
    }

    return {
        id: `Q-${Date.now()}`,
        taskId: task.id,
        providerName,
        items,
        total: items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
        status: 'DRAFT',
        createdAt: new Date().toISOString()
    };
};

// NEW: Simulate AI parsing a natural language command into a Quote Item
export const parseQuoteRequest = async (text: string): Promise<QuoteItem> => {
    // In a real app, this calls Gemini to extract JSON
    // Mock logic:
    const priceMatch = text.match(/\$(\d+)|(\d+)元/);
    const price = priceMatch ? parseInt(priceMatch[1] || priceMatch[2]) : 500;
    
    let category: any = 'LABOR';
    if (text.includes('料') || text.includes('件') || text.includes('part')) category = 'MATERIAL';
    if (text.includes('保') || text.includes('險')) category = 'INSURANCE';

    return {
        id: `qi-${Date.now()}`,
        description: text.replace(/\$(\d+)|(\d+)元/, '').trim() || '新增項目',
        quantity: 1,
        unitPrice: price,
        category
    };
}
