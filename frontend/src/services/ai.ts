// We're using the OpenAI gpt-3.5-turbo model for chat
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Enable browser usage
});

export async function generateResponse(message: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant specializing in Web3, blockchain, and file management. You help users understand decentralized storage, IPFS, and related technologies.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      stream: true,
    });

    // Create a ReadableStream that properly handles the OpenAI stream
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      },
    });

    // Return the properly formatted streaming response
    return new Response(stream);
  } catch (error) {
    console.error("Error calling AI API:", error);
    throw error;
  }
}
