import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

export const generateEventDescription = async (
  title: string,
  location: string,
  styleNotes: string
): Promise<string> => {
  if (!apiKey) {
    console.warn("No API Key provided. Returning mock data.");
    return `[演示模式] 这是一个关于${title}的精彩活动，地点在${location}。期待您的参与！`;
  }

  try {
    const prompt = `
      你是一个专业摄影活动的文案策划。请根据以下信息，写一段吸引人的摄影活动招募文案。
      风格要清新、自然，符合“绿森林”这个社团的名字。
      
      活动主题：${title}
      活动地点：${location}
      活动风格/备注：${styleNotes}
      
      要求：
      1. 字数在100-150字之间。
      2. 包含适当的emoji表情。
      3. 语气热情且专业。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "无法生成文案，请重试。";
  } catch (error) {
    console.error("Error generating content:", error);
    return "生成文案时发生错误，请检查网络或API Key。";
  }
};