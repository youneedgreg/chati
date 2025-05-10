import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'assistant' | string;
  content: string;
}

interface OpenRouterResponse {
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
}

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await request.json();

    const userMessages = messages
      .filter((msg) => msg.role === 'user')
      .map((msg) => msg.content);

    const lastUserMessage =
      userMessages.length > 0 ? userMessages[userMessages.length - 1] : 'Hello';

    const systemPrompt =
      "You are a helpful AI wellness assistant named CHATI. Your goal is to provide supportive, " +
      "empathetic guidance on mental health, wellness, and personal development topics. You are " +
      "conversational, warm, and encouraging. You offer practical advice while being mindful that " +
      "you are not a licensed therapist or medical professional. Keep your responses well-structured " +
      "with proper paragraph breaks. You should naturally offer suggestions and follow-up guidance " +
      "as appropriate, such as 'Would you like me to help you create a custom meditation routine?' " +
      "or 'I can suggest some breathing exercises that might help with this anxiety.' These natural " +
      "continuations create a helpful, proactive conversation. However, never speak on behalf of the " +
      "user or generate their responses.";

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': '<YOUR_SITE_URL>', // Optional
        'X-Title': '<YOUR_SITE_NAME>', // Optional
      },
      body: JSON.stringify({
        model: 'nousresearch/deephermes-3-mistral-24b-preview:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: lastUserMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      throw new Error(errorText || 'Failed to fetch from OpenRouter API');
    }

    const data: OpenRouterResponse = await response.json();

    const assistantResponse =
      data.choices?.[0]?.message?.content?.trim() ??
      "I'm sorry, I couldn't generate a response at the moment.";

    return NextResponse.json({ content: assistantResponse });
  } catch (error: unknown) {
    console.error('Error processing OpenRouter chat request:', error);

    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to process chat request: ${message}` }, { status: 500 });
  }
}
