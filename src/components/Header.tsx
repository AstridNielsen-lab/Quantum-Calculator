import React from 'react';
import { Brain, Calculator } from 'lucide-react';

interface HeaderProps {
  mode: 'calculator' | 'ai';
  toggleMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ mode, toggleMode }) => {
  return (
    <header className="bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className={`mr-3 p-2 rounded-full ${mode === 'calculator' ? 'bg-purple-700' : 'bg-blue-700'}`}>
            {mode === 'calculator' ? <Calculator size={24} /> : <Brain size={24} />}
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400">
            Quantum {mode === 'calculator' ? 'Calculator' : 'AI Assistant'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex p-1 bg-gray-800 bg-opacity-50 rounded-lg">
            <button
              onClick={toggleMode}
              className={`px-3 py-1 rounded-md transition-colors flex items-center ${
                mode === 'calculator' ? 'bg-purple-700' : 'bg-transparent'
              }`}
            >
              <Calculator size={16} className="mr-1" />
              <span className="hidden sm:inline">Calculator</span>
            </button>
            <button
              onClick={toggleMode}
              className={`px-3 py-1 rounded-md transition-colors flex items-center ${
                mode === 'ai' ? 'bg-blue-700' : 'bg-transparent'
              }`}
            >
              <Brain size={16} className="mr-1" />
              <span className="hidden sm:inline">AI Assistant</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;