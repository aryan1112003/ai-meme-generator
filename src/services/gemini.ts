import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config/constants';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function generateCaptions(prompt: string, style: string = 'funny'): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const result = await model.generateContent(`
    Generate 3 creative and ${style} captions for a meme about: ${prompt}
    Make them witty, relevant, and suitable for social media.
    Return only the captions, one per line.
  `);

  const response = result.response;
  const text = response.text();
  return text.split('\n').filter(line => line.trim());
}