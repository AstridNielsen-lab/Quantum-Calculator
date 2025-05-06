import { useState, useEffect, useCallback } from 'react';

interface SpeechRecognitionHook {
  listening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'pt-BR';
        
        recognitionInstance.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          setTranscript(transcript);
        };
        
        recognitionInstance.onerror = (event: any) => {
          setError(`Speech recognition error: ${event.error}`);
          setListening(false);
        };
        
        recognitionInstance.onend = () => {
          setListening(false);
        };
        
        setRecognition(recognitionInstance);
      } else {
        setError('Speech recognition not supported in this browser');
      }
    } catch (err) {
      setError('Failed to initialize speech recognition');
    }
    
    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        setError(null);
        setTranscript('');
        recognition.start();
        setListening(true);
      } catch (err) {
        setError('Failed to start speech recognition');
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition && listening) {
      recognition.stop();
      setListening(false);
    }
  }, [recognition, listening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    listening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error
  };
}