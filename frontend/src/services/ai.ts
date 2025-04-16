// We're using the microsoft/DialoGPT-medium model for chat
const API_URL = import.meta.env.VITE_HUGGING_FACE_API_URL;

// Replace with your Hugging Face API token
const API_TOKEN = import.meta.env.VITE_HUGGING_FACE_API_TOKEN;

export async function generateResponse(message: string): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          text: message,
          max_length: 100,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data[0]?.generated_text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error calling AI API:", error);
    return "Sorry, I encountered an error. Please try again later.";
  }
}
