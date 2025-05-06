import React from 'react';
import { Calculator } from 'lucide-react';

interface CalculatorDisplayProps {
  result: string;
  history: Array<{ input: string; output: string; mode: 'calculator' | 'ai' }>;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ result, history }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-center mb-4">
        <Calculator className="mr-2 text-purple-400" size={24} />
        <h2 className="text-xl font-bold">Quantum Calculator</h2>
      </div>
      
      <div className="bg-gray-800 bg-opacity-60 p-4 rounded-lg mb-4 min-h-40 flex flex-col">
        {!result && history.length === 0 ? (
          <div className="text-gray-400 flex-1 flex items-center justify-center text-center">
            <p>Enter a mathematical expression<br />or speak your calculation</p>
          </div>
        ) : (
          <>
            {result && (
              <div className="text-right">
                <div className="text-gray-300 text-sm mb-1">Result:</div>
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400">
                  {result}
                </div>
              </div>
            )}
            
            {history.length > 0 && (
              <div className="mt-6">
                <div className="text-gray-300 text-sm mb-2">History:</div>
                <div className="max-h-40 overflow-y-auto pr-2">
                  {history.map((item, index) => (
                    <div key={index} className="bg-gray-900 bg-opacity-50 p-2 rounded mb-2">
                      <div className="text-gray-400 text-sm">{item.input}</div>
                      <div className="text-right font-medium">{item.output}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CalculatorDisplay;