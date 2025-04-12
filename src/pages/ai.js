import Vapi from "@vapi-ai/web";

export const vapi = new Vapi(import.meta.env.VITE_VAPI_API_KEY);
const assistantId = import.meta.env.VITE_ASSISTANT_ID;

// Initialize all event listeners
const initializeVapi = () => {
  // Core conversation events
  vapi.on('message', (message) => {
    console.log('Message event:', message);
    // Ensure the message has content before processing
    if (message.content) {
      console.log(`${message.role}: ${message.content}`);
    }
  });

  // Call lifecycle events
  vapi.on('call-start', () => console.log('Call started'));
  vapi.on('call-end', () => console.log('Call ended'));

  // Speech detection
  vapi.on('user-speech-start', () => console.log('User started speaking'));
  vapi.on('user-speech-end', () => console.log('User stopped speaking'));
  vapi.on('speech-start', () => console.log('Assistant started speaking'));
  vapi.on('speech-end', () => console.log('Assistant stopped speaking'));

  // Error handling
  vapi.on('error', (error) => console.error('VAPI error:', error));
};

// Initialize immediately when imported
initializeVapi();

export const startAssistant = async () => {
  try {
    if (!assistantId) throw new Error('Missing assistant ID');
    
    console.log('Starting assistant with ID:', assistantId);
    const response = await vapi.start(assistantId);
    console.log('Assistant started successfully', response);
    return true;
  } catch (error) {
    console.error('Error starting assistant:', error);
    throw error;
  }
};

export const stopAssistant = async () => {
  try {
    const response = await vapi.stop();
    console.log('Assistant stopped', response);
    return true;
  } catch (error) {
    console.error('Error stopping assistant:', error);
    throw error;
  }
};