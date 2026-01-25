/**
 * Genesis AI - Chat Service
 * Handles mock AI responses
 */

import type { ChatResponse } from '../types';
import { AI_RESPONSE_DELAY } from '../config';
import { delay, randomInRange } from '../utils/formatters';

/** Pre-defined response categories */
const RESPONSES = {
  greetings: [
    "Hello! I'm Genesis AI, your retro-styled assistant. How can I help you today?",
    'Greetings! Welcome to Genesis AI. What would you like to discuss?',
    "Hi there! I'm ready to assist you. What's on your mind?",
  ],

  codeExamples: [
    `Here's a simple example of a recursive function:

\`\`\`javascript
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log(factorial(5)); // Output: 120
\`\`\`

This function calculates the factorial of a number by calling itself with a smaller value until it reaches the base case.`,

    `Here's how you can create a simple DOS-style button using DOSage:

\`\`\`typescript
import { createButton } from 'dosage';

const button = createButton({
  label: 'Click Me',
  variant: 'primary',
  onClick: () => console.log('Button clicked!')
});

document.body.appendChild(button);
\`\`\`

The DOSage library provides pre-built components with authentic DOS styling.`,
  ],

  general: [
    "That's an interesting question! Let me think about it...\n\nBased on my understanding, I would approach this by breaking it down into smaller, manageable parts. Would you like me to elaborate on any specific aspect?",
    "I appreciate you asking! Here's my perspective:\n\n• First, consider the context\n• Second, evaluate the options\n• Third, make an informed decision\n\nWould you like more details on any of these points?",
    'Great question! There are several ways to look at this:\n\n1. From a technical standpoint\n2. From a practical standpoint\n3. From a user experience standpoint\n\nWhich angle interests you most?',
  ],

  fallback: [
    "I'm here to help! Feel free to ask me about programming, DOS aesthetics, or just have a chat. What would you like to explore?",
    "Interesting! While I'm a demo AI, I can simulate helpful responses. Try asking me about code, DOS history, or general topics!",
    "I'm processing your request... As a retro AI, I appreciate all questions! Is there something specific you'd like to know?",
  ],
};

/** Keywords for response matching */
const KEYWORDS = {
  greetings: ['hello', 'hi', 'hey', 'greetings', 'howdy', 'good morning', 'good afternoon'],
  code: ['code', 'function', 'programming', 'javascript', 'typescript', 'example', 'how to', 'create', 'build', 'dosage'],
};

class ChatServiceClass {
  /** Analyze message and generate appropriate response */
  private analyzeMessage(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Check for greetings
    if (KEYWORDS.greetings.some((kw) => lowerMessage.includes(kw))) {
      return this.getRandomResponse('greetings');
    }

    // Check for code-related questions
    if (KEYWORDS.code.some((kw) => lowerMessage.includes(kw))) {
      return this.getRandomResponse('codeExamples');
    }

    // Check message length for general vs fallback
    if (message.length > 20) {
      return this.getRandomResponse('general');
    }

    return this.getRandomResponse('fallback');
  }

  /** Get random response from category */
  private getRandomResponse(category: keyof typeof RESPONSES): string {
    const responses = RESPONSES[category];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /** Calculate mock token count */
  private calculateTokens(text: string): number {
    // Rough approximation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  /** Send message and get AI response */
  async sendMessage(message: string): Promise<ChatResponse> {
    // Simulate network/processing delay
    const delayMs = randomInRange(AI_RESPONSE_DELAY.min, AI_RESPONSE_DELAY.max);
    await delay(delayMs);

    const content = this.analyzeMessage(message);
    const tokens = this.calculateTokens(content);

    return {
      content,
      tokens,
      model: 'Genesis-1',
    };
  }

  /** Stream response word by word (for future enhancement) */
  async *streamResponse(message: string): AsyncGenerator<string> {
    const response = await this.sendMessage(message);
    const words = response.content.split(' ');

    for (const word of words) {
      await delay(50); // 50ms between words
      yield word + ' ';
    }
  }
}

/** Singleton chat service instance */
export const ChatService = new ChatServiceClass();
