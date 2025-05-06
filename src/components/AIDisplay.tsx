import React from 'react';
import { Brain } from 'lucide-react';

interface AIDisplayProps {
  result: string;
  history: Array<{ input: string; output: string; mode: 'calculator' | 'ai' }>;
}

const AIDisplay: React.FC<AIDisplayProps> = ({ result, history }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-center mb-4">
        <Brain className="mr-2 text-blue-400" size={24} />
        <h2 className="text-xl font-bold">Quantum AI Assistant</h2>
      </div>
      
      <div className="bg-gray-800 bg-opacity-60 p-4 rounded-lg mb-4 min-h-40 flex flex-col">
        {!result && history.length === 0 ? (
          <div className="text-gray-400 flex-1 flex items-center justify-center text-center">
            <p>Ask me anything<br />or speak your question</p>
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto space-y-4">
            {history.length > 0 && history.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg rounded-br-none inline-block max-w-[75%]">
                  <p className="text-gray-200">{item.input}</p>
                </div>
                <div className="bg-blue-700 bg-opacity-50 p-3 rounded-lg rounded-bl-none inline-block max-w-[75%] ml-auto">
                  <p className="text-gray-100">{item.output}</p>
                </div>
              </div>
            ))}
            
            {result && !history.some(item => item.output === result) && (
              <div className="bg-blue-700 bg-opacity-50 p-3 rounded-lg rounded-bl-none inline-block max-w-[75%] ml-auto">
                <p className="text-gray-100">{result}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDisplay;