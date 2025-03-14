// app/api/search/route.ts
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { query } = await request.json();
    
    // Modified system prompt that instructs to use bold formatting
    // and include references directly in the content
    const searchSystemPrompt = 
      "You are CHATI, a helpful AI wellness assistant with access to internet search results. " +
      "Your goal is to provide supportive, empathetic guidance on mental health, wellness, and personal development topics. " +
      "Format key points with proper HTML bold tags (<b>Important Point</b>) instead of using asterisks. " +
      "You are conversational, warm, and encouraging. You offer practical advice while being mindful that " +
      "you are not a licensed therapist or medical professional. " +
      "Include recent facts, studies, and statistics when relevant. " +
      "Always cite specific sources when mentioning research or facts. " +
      "At the end of your response, include a 'References:' section that lists all sources used with full URLs. " +
      "Format references exactly like this: 'Author/Organization. (Year). Title. Retrieved from https://full-url/' " +
      "Always include the full URL so it can be rendered as a clickable link. " +
      "Keep your responses well-structured with proper paragraph breaks. " +
      "Never generate follow-up user messages or questions." +
      "Do not include a separate 'Sources:' section, only include the 'References:' section.";
    
    // Create the payload for Hugging Face Inference API with search context
    const payload = {
      inputs: `${searchSystemPrompt}\n\nUser's question: ${query}\n\nCHATI (using internet search results):`,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
        stop: ["User:", "User", "\nUser"]
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
    assistantResponse = assistantResponse.split("CHATI (using internet search results):")[1]?.trim() || assistantResponse;
    
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
    
    
    // Replace any remaining asterisk formatting with HTML bold tags for the frontend
    assistantResponse = assistantResponse.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    
    // Return just the content
    return NextResponse.json({ 
      content: assistantResponse
    });
    
  } catch (error) {
    console.error('Error processing search request:', error);
    
    let errorMessage = 'Failed to process search request';
    
    if (error.message) {
      errorMessage += `: ${error.message}`;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}