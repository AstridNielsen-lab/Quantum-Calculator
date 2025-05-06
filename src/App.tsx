import React, { useState, useEffect } from 'react';
import { Brain, Calculator, Mic, Send, Volume2 } from 'lucide-react';
import Header from './components/Header';
import QuantumBackground from './components/QuantumBackground';
import CalculatorDisplay from './components/CalculatorDisplay';
import AIDisplay from './components/AIDisplay';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { evaluateMathExpression } from './utils/calculatorUtils';
import { fetchAIResponse } from './services/geminiService';
import './App.css';

function App() {
  const [mode, setMode] = useState<'calculator' | 'ai'>('calculator');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ input: string; output: string; mode: 'calculator' | 'ai' }>>([]);

  const { 
    listening, 
    startListening, 
    stopListening, 
    transcript, 
    resetTranscript 
  } = useSpeechRecognition();
  
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const toggleMode = () => {
    setMode(prev => prev === 'calculator' ? 'ai' : 'calculator');
    setResult('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const processInput = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    
    try {
      if (mode === 'calculator') {
        try {
          const calculationResult = evaluateMathExpression(input);
          setResult(calculationResult.toString());
          speak(`${input} equals ${calculationResult}`);
          addToHistory(input, calculationResult.toString(), 'calculator');
        } catch (error) {
          setResult('Error in calculation');
          speak('Sorry, there was an error in the calculation');
        }
      } else {
        // AI mode
        const aiResponse = await fetchAIResponse(input);
        setResult(aiResponse);
        speak(aiResponse);
        addToHistory(input, aiResponse, 'ai');
      }
    } catch (error) {
      setResult('An error occurred. Please try again.');
      speak('An error occurred. Please try again.');
    } finally {
      setLoading(false);
      resetTranscript();
      setInput('');
    }
  };

  const addToHistory = (input: string, output: string, mode: 'calculator' | 'ai') => {
    setHistory(prev => [...prev, { input, output, mode }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processInput();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white">
      <QuantumBackground />
      
      <div className="relative z-10">
        <Header mode={mode} toggleMode={toggleMode} />
        
        <main className="container mx-auto px-4 py-8 max-w-4xl flex flex-col items-center">
          <div className={`transition-all duration-500 w-full max-w-lg bg-black bg-opacity-30 backdrop-blur-lg rounded-xl p-6 shadow-lg ${loading ? 'animate-pulse' : ''}`}>
            {mode === 'calculator' ? (
              <CalculatorDisplay result={result} history={history.filter(item => item.mode === 'calculator')} />
            ) : (
              <AIDisplay result={result} history={history.filter(item => item.mode === 'ai')} />
            )}
            
            <div className="mt-6 relative">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 pr-20 bg-gray-800 bg-opacity-70 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={mode === 'calculator' 
                    ? "Type or speak your calculation..." 
                    : "Ask me anything..."}
                  disabled={listening || loading}
                />
                
                <div className="absolute right-2 flex space-x-2">
                  <button 
                    onClick={listening ? stopListening : startListening}
                    className={`p-2 rounded-full ${listening ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                    title={listening ? "Stop listening" : "Start voice input"}
                  >
                    <Mic size={18} className={listening ? 'animate-pulse' : ''} />
                  </button>
                  
                  <button 
                    onClick={processInput}
                    className="p-2 bg-purple-700 hover:bg-purple-600 rounded-full"
                    disabled={!input.trim() || loading}
                    title="Send"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
              
              {listening && (
                <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-purple-500 animate-soundwave"></div>
                    <div className="w-1 h-2 bg-purple-500 animate-soundwave animation-delay-100"></div>
                    <div className="w-1 h-3 bg-purple-500 animate-soundwave animation-delay-200"></div>
                    <div className="w-1 h-4 bg-purple-500 animate-soundwave animation-delay-300"></div>
                    <div className="w-1 h-3 bg-purple-500 animate-soundwave animation-delay-400"></div>
                    <div className="w-1 h-2 bg-purple-500 animate-soundwave animation-delay-500"></div>
                    <div className="w-1 h-1 bg-purple-500 animate-soundwave animation-delay-600"></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                onClick={toggleMode}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  mode === 'calculator' 
                    ? 'bg-purple-700 hover:bg-purple-600' 
                    : 'bg-blue-700 hover:bg-blue-600'
                }`}
              >
                {mode === 'calculator' ? (
                  <>
                    <Brain size={18} className="mr-2" />
                    <span>Switch to AI Mode</span>
                  </>
                ) : (
                  <>
                    <Calculator size={18} className="mr-2" />
                    <span>Switch to Calculator</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => result && speak(result)}
                className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                disabled={!result}
              >
                <Volume2 size={18} className="mr-2" />
                <span>Read Aloud</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;