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
      "with proper paragraph breaks. You should naturally offer suggestions and follow-up guidance " +
      "as appropriate, such as 'Would you like me to help you create a custom meditation routine?' " +
      "or 'I can suggest some breathing exercises that might help with this anxiety.' These natural " +
      "continuations create a helpful, proactive conversation. However, never speak on behalf of the " +
      "user or generate their responses.";
    
    // Create the payload for Hugging Face Inference API
    const payload = {
      inputs: `${systemPrompt}\n\n${lastUserMessage}\n\nCHATI:`,
      parameters: {
        max_new_tokens: 800,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
        stop: ["User:", "\nUser:"] // Only stop at explicit user turns
      }
    };

    // Call the Hugging Face Inference API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta"
,
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
    
    // Remove any "User:" parts and everything after it (still need this as a safety)
    if (assistantResponse.includes("User:")) {
      assistantResponse = assistantResponse.split("User:")[0].trim();
    }
    
    // Check for other user prompt patterns but be more selective
    const userPatterns = [
      "\nUser ", 
      "\nHuman:", 
      "\nYou: ",
      "Human: ",
      "\nPerson: "
    ];
    
    for (const pattern of userPatterns) {
      if (assistantResponse.includes(pattern)) {
        assistantResponse = assistantResponse.split(pattern)[0].trim();
      }
    }
    
    // Don't remove natural follow-up questions!
    // Only filter out patterns that represent the model trying to speak as the user
    
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