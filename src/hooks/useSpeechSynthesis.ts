import { useCallback } from 'react';

interface SpeechSynthesisHook {
  speak: (text: string) => void;
  cancel: () => void;
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Try to select a Portuguese voice if available
    const voices = window.speechSynthesis.getVoices();
    const portugueseVoice = voices.find(voice => 
      voice.lang.includes('pt') || voice.lang.includes('PT')
    );
    
    if (portugueseVoice) {
      utterance.voice = portugueseVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }, []);

  const cancel = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, cancel };
}