import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import VoiceRecorder from '../components/VoiceRecorder';
import { useToast } from '../context/ToastContext';
import useUser from '../hooks/useUser';
import { useRecipes, RecipeProvider } from '../context/RecipeContext';
import RecipeGeneratorModal from '../components/RecipeGeneratorModal';
import TrackingModal from '../components/TrackingModal';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const AssistantContent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! I\'m Guaco, your personal assistant. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const [user] = useUser();
  const navigate = useNavigate();
  const { categories, fetchCategories } = useRecipes();
  
  // Modal states
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const [recipePrompt, setRecipePrompt] = useState('');
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingType, setTrackingType] = useState<'water' | 'food' | 'exercise'>('water');
  const [trackingValue, setTrackingValue] = useState('');

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Fetch categories on initial render
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);
    
    // Process the message based on intent
    try {
      const lowerText = text.toLowerCase().trim();
      
      // Handle recipe generation intent
      if (lowerText.includes('generate recipe') || lowerText.includes('create recipe') || lowerText.includes('make recipe')) {
        // Extract the recipe prompt
        const prompt = lowerText.replace(/generate recipe|create recipe|make recipe/i, '').trim();
        setRecipePrompt(prompt || 'a healthy meal');
        setRecipeModalOpen(true);
        setIsProcessing(false);
        return;
      }
      
      // Handle water tracking intent
      if (lowerText.includes('log water') || lowerText.includes('track water')) {
        // Extract amount if present
        const amountMatch = lowerText.match(/(\d+)\s*(ml|cups?|oz|liters?)/i);
        const amount = amountMatch ? amountMatch[0] : '';
        
        setTrackingType('water');
        setTrackingValue(amount);
        setTrackingModalOpen(true);
        setIsProcessing(false);
        return;
      }
      
      // Handle food tracking intent
      if (lowerText.includes('log food') || lowerText.includes('track food')) {
        // Extract food details if present
        const foodDetails = lowerText.replace(/log food|track food/i, '').trim();
        
        setTrackingType('food');
        setTrackingValue(foodDetails);
        setTrackingModalOpen(true);
        setIsProcessing(false);
        return;
      }
      
      // Handle exercise tracking intent
      if (lowerText.includes('log exercise') || lowerText.includes('track exercise')) {
        // Extract exercise details if present
        const exerciseDetails = lowerText.replace(/log exercise|track exercise/i, '').trim();
        
        setTrackingType('exercise');
        setTrackingValue(exerciseDetails);
        setTrackingModalOpen(true);
        setIsProcessing(false);
        return;
      }
      
      // Handle navigation intents
      if (lowerText.includes('open grocery list')) {
        navigate('/grocery');
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Opening grocery list...',
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsProcessing(false);
        return;
      }
      
      if (lowerText.includes('open recipes')) {
        navigate('/recipes');
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Opening recipes...',
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsProcessing(false);
        return;
      }
      
      if (lowerText.includes('open tracker')) {
        navigate('/tracker');
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Opening tracker...',
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsProcessing(false);
        return;
      }
      
      // Default response for unrecognized intents
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `I received: "${text.trim()}". You can try commands like "generate recipe", "log water", or "open recipes".`,
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsProcessing(false);
      }, 1000);
    } catch (error) {
      console.error('Error processing message:', error);
      showToast('Failed to process your request', 'error');
      setIsProcessing(false);
    }
  };

  const handleQuickCommand = (command: string) => {
    setInputText(command);
    handleSendMessage(command);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        <div className="max-w-3xl mx-auto">
          {messages.map(message => (
            <div
              key={message.id}
              className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-primary-500 text-white rounded-tr-none'
                    : 'bg-gray-200 text-gray-800 rounded-tl-none'
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs opacity-70 text-right mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick commands */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="overflow-x-auto whitespace-nowrap pb-2">
          <div className="inline-flex gap-2">
            <button
              onClick={() => handleQuickCommand('Generate recipe')}
              className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
            >
              Generate recipe
            </button>
            <button
              onClick={() => handleQuickCommand('Log water')}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
            >
              Log water
            </button>
            <button
              onClick={() => handleQuickCommand('Log food')}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
            >
              Log food
            </button>
            <button
              onClick={() => handleQuickCommand('Log exercise')}
              className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
            >
              Log exercise
            </button>
            <button
              onClick={() => handleQuickCommand('Open grocery list')}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
            >
              Open grocery list
            </button>
            <button
              onClick={() => handleQuickCommand('Open recipes')}
              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"
            >
              Open recipes
            </button>
            <button
              onClick={() => handleQuickCommand('Open tracker')}
              className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"
            >
              Open tracker
            </button>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 p-4 safe-bottom">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <VoiceRecorder onTranscript={(transcript) => setInputText(transcript)} />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isProcessing}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isProcessing}
            className={`p-2 rounded-full ${
              !inputText.trim() || isProcessing
                ? 'bg-gray-200 text-gray-400'
                : 'bg-primary-500 text-white'
            }`}
          >
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Recipe Generator Modal */}
      <RecipeGeneratorModal
        open={recipeModalOpen}
        onClose={() => setRecipeModalOpen(false)}
        prompt={recipePrompt}
      />

      {/* Tracking Modal */}
      <TrackingModal
        open={trackingModalOpen}
        onClose={() => setTrackingModalOpen(false)}
        type={trackingType}
        initialValue={trackingValue}
      />
    </div>
  );
};

const Assistant: React.FC = () => {
  return (
    <RecipeProvider>
      <AssistantContent />
    </RecipeProvider>
  );
};

export default Assistant;