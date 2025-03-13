import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages } = await request.json();
    
    // Format messages for the API
    const userMessages = messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content);
    
    const lastUserMessage = userMessages.length > 0 
      ? userMessages[userMessages.length - 1] 
      : "Hello";

    const systemPrompt = 
      "You are a helpful AI wellness assistant named CHATI. Your goal is to provide supportive, " +
      "empathetic guidance on mental health, wellness, and personal development topics. You are " +
      "conversational, warm, and encouraging. You offer practical advice while being mindful that " +
      "you are not a licensed therapist or medical professional. Keep your responses well-structured " +
      "with proper paragraph breaks. Never generate follow-up user messages or questions.";
    
    // Create the payload for Hugging Face Inference API - MODIFIED TO REMOVE "User:" PROMPT
    const payload = {
      inputs: `${systemPrompt}\n\n${lastUserMessage}\n\nCHATI:`,
      parameters: {
        max_new_tokens: 800,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
        stop: ["User:", "User", "\nUser"]  // Keep these stop sequences
      }
    };

    // Call the Hugging Face Inference API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(errorText || 'Failed to fetch from API');
    }

    const data = await response.json();
    
    // Extract the assistant's response from the generated text
    let assistantResponse = data[0]?.generated_text || "I'm sorry, I'm having trouble connecting right now.";
    
    // Clean up the response to get just the assistant's part
    assistantResponse = assistantResponse.split("CHATI:")[1]?.trim() || assistantResponse;
    
    // Remove any "User:" parts and everything after it
    if (assistantResponse.includes("User:")) {
      assistantResponse = assistantResponse.split("User:")[0].trim();
    }
    
    // Remove any variations like "User " or similar user prompts
    const userVariations = ["\nUser ", " User ", "\nHuman:", " Human:"];
    for (const variation of userVariations) {
      if (assistantResponse.includes(variation)) {
        assistantResponse = assistantResponse.split(variation)[0].trim();
      }
    }
    
    // Additional cleanup for common response endings that suggest a user turn
    const cleanupPatterns = [
      "What would you like to know more about?",
      "Do you have any other questions?",
      "Is there something specific you'd like me to explain?",
      "Would you like to know more about this topic?"
    ];
    
    for (const pattern of cleanupPatterns) {
      if (assistantResponse.endsWith(pattern)) {
        assistantResponse = assistantResponse.substring(0, assistantResponse.length - pattern.length).trim();
      }
    }
    
    // Return the cleaned up response
    return NextResponse.json({ content: assistantResponse });
  } catch (error) {
    console.error('Error processing chat request:', error);
    
    let errorMessage = 'Failed to process chat request';
    
    if (error.message) {
      errorMessage += `: ${error.message}`;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}