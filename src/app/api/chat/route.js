// Updated app/api/chat/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages } = await request.json();
    
    // Format messages for the Hugging Face API
    const userMessages = messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content);
    
    const lastUserMessage = userMessages.length > 0 
      ? userMessages[userMessages.length - 1] 
      : "Hello";

    const systemPrompt = 
      "You are a helpful AI wellness assistant named CHATI. Your goal is to provide supportive, " +
      "empathetic guidance on mental health, wellness, and personal development topics.";
    
    const payload = {
      inputs: `${systemPrompt}\n\nUser: ${lastUserMessage}\n\nCHATI:`,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
      }
    };

    // Check if API key exists
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      throw new Error('HUGGINGFACE_API_KEY not found in environment variables');
    }

    // Call the Hugging Face Inference API with proper authentication
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', errorText);
      
      // Try to parse the error as JSON if possible
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        // If it can't be parsed as JSON, use the text directly
      }
      
      throw new Error(
        errorJson?.error || 
        `Hugging Face API error (${response.status}): ${errorText.substring(0, 100)}`
      );
    }

    const data = await response.json();
    
    // Extract the assistant's response from the generated text
    let assistantResponse = data[0]?.generated_text || "I'm sorry, I'm having trouble connecting right now.";
    
    // Clean up the response to get just the assistant's part
    assistantResponse = assistantResponse.split("CHATI:")[1]?.trim() || assistantResponse;
    
    return NextResponse.json({ content: assistantResponse });
  } catch (error) {
    console.error('Error processing chat request:', error);
    
    return NextResponse.json(
      { error: `Failed to process chat request: ${error.message}` },
      { status: 500 }
    );
  }
}