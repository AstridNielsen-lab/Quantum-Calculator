/**
 * Fetches an AI response from the Google Gemini API.
 * 
 * @param prompt - The user's prompt text
 * @returns Promise resolving to the AI response text
 */
export async function fetchAIResponse(prompt: string): Promise<string> {
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
  const API_KEY = "AIzaSyAuFi5KtPsMJI5IC8c5FjvYD5IbuBdwH_U";
  
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated');
    }
    
    // Extract the text from the first candidate's first part
    const text = data.candidates[0].content.parts[0].text || '';
    return text;
    
  } catch (error) {
    console.error('Error fetching AI response:', error);
    return 'Sorry, I encountered an error processing your request. Please try again.';
  }
}