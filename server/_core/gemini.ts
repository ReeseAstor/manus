import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from './env';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(ENV.geminiApiKey);

/**
 * Generate text using Gemini AI
 * @param prompt - The prompt to send to Gemini
 * @param systemInstruction - Optional system instruction to guide the AI
 * @returns Generated text response
 */
export async function generateText(
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction,
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('[Gemini AI] Error generating text:', error);
    throw new Error('Failed to generate AI response');
  }
}

/**
 * Generate streaming text using Gemini AI
 * @param prompt - The prompt to send to Gemini
 * @param systemInstruction - Optional system instruction to guide the AI
 * @returns Async generator yielding text chunks
 */
export async function* generateTextStream(
  prompt: string,
  systemInstruction?: string
): AsyncGenerator<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction,
    });

    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        yield text;
      }
    }
  } catch (error) {
    console.error('[Gemini AI] Error generating stream:', error);
    throw new Error('Failed to generate AI stream');
  }
}

/**
 * Chat with Gemini AI (maintains conversation history)
 */
export async function createChat(systemInstruction?: string) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction,
  });

  const chat = model.startChat({
    history: [],
  });

  return {
    /**
     * Send a message and get a response
     */
    async sendMessage(message: string): Promise<string> {
      try {
        const result = await chat.sendMessage(message);
        return result.response.text();
      } catch (error) {
        console.error('[Gemini AI] Error sending message:', error);
        throw new Error('Failed to send message');
      }
    },

    /**
     * Send a message and get a streaming response
     */
    async *sendMessageStream(message: string): AsyncGenerator<string> {
      try {
        const result = await chat.sendMessageStream(message);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            yield text;
          }
        }
      } catch (error) {
        console.error('[Gemini AI] Error sending message stream:', error);
        throw new Error('Failed to send message stream');
      }
    },

    /**
     * Get chat history
     */
    async getHistory() {
      return await chat.getHistory();
    },
  };
}
