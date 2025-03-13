// test-mistral.js
const { MistralClient } = require('@mistralai/mistralai');

async function testMistral() {
  try {
    // Replace with your actual API key
    const client = new MistralClient("Wmsfdit9ghxbmmTSCITLNGtfyCjP8LdG");
    
    const response = await client.chat({
      model: "mistral-tiny",
      messages: [{role: "user", content: "Hello! How are you?"}],
    });
    
    console.log("Mistral API response:", response);
  } catch (error) {
    console.error("Error testing Mistral:", error);
  }
}

testMistral();