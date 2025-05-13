
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Bot, 
  Send, 
  TrendingUp, 
  Calendar, 
  Users, 
  BookOpen, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

type Message = {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
};

type InsightCard = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
};

const VenueGPT = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m VenueGPT, your AI assistant for venue analytics and insights. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const insightCards: InsightCard[] = [
    {
      id: '1',
      title: 'Peak Hours Shifting',
      description: 'We\'ve detected that your peak hours are now 8-10 PM, shifting from the previous 9-11 PM time slot.',
      icon: <Clock className="h-5 w-5 text-gold" />,
      trend: 'up'
    },
    {
      id: '2',
      title: 'DJ Performance Impact',
      description: 'Events featuring DJ Alex M drew 32% more attendance than your average weekend nights.',
      icon: <Music className="h-5 w-5 text-gold" />,
      trend: 'up'
    },
    {
      id: '3',
      title: 'Booking Pattern Change',
      description: 'Tuesday bookings have increased by 18% following your new weekday promotion.',
      icon: <Calendar className="h-5 w-5 text-gold" />,
      trend: 'up'
    },
    {
      id: '4',
      title: 'VIP Table Revenue',
      description: 'VIP tables near the stage are generating 45% more revenue per square foot than other areas.',
      icon: <TrendingUp className="h-5 w-5 text-gold" />
    }
  ];

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!prompt.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: prompt,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "Based on your data, Thursday nights are becoming increasingly popular. Consider adding a special event or promotion to capitalize on this trend.",
        "I've analyzed your booking patterns and noticed that guests who reserve VIP tables tend to spend 40% more on drinks. Consider creating a VIP package that includes premium drink options.",
        "Your most profitable hours are between 10 PM and 1 AM. You might want to consider extending your happy hour to bring in customers earlier and increase overall revenue.",
        "Looking at seasonal trends, your outdoor space usage drops by 62% during winter months. Consider adding outdoor heaters or covered areas to maintain its usability year-round."
      ];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white/5 p-6 border border-white/10 rounded-md flex flex-col h-[600px]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center">
            <Bot className="h-5 w-5 text-gold" />
          </div>
          <div>
            <h3 className="text-xl font-medium">VenueGPT Assistant</h3>
            <p className="text-sm text-white/60">AI-powered insights for your venues</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-gold/20 text-white' 
                    : 'bg-white/10 text-white'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-white/40 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-white/10">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="mt-auto flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about venue trends, performance, or suggestions..."
            className="bg-white/5 border-white/20"
          />
          <Button onClick={handleSendMessage} className="flex items-center gap-2">
            <Send size={18} />
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white/5 p-6 border border-white/10 rounded-md">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-gold" />
            <h3 className="text-lg font-medium">AI-Generated Insights</h3>
          </div>
          
          <div className="space-y-4">
            {insightCards.map((card) => (
              <motion.div 
                key={card.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Number(card.id) * 0.1 }}
                className="p-3 border border-white/10 bg-white/5 rounded-md hover:bg-white/10 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 mb-2">
                    {card.icon}
                    <h4 className="font-medium">{card.title}</h4>
                  </div>
                  {card.trend && (
                    <span className={`text-xs ${card.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {card.trend === 'up' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/70">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="bg-white/5 p-6 border border-white/10 rounded-md">
          <h3 className="text-lg font-medium mb-4">Suggested Queries</h3>
          
          <div className="space-y-2">
            {[
              "What's my busiest day of the week?",
              "Which promotions are most effective?",
              "How can I improve customer retention?",
              "Analyze my venue's peak hours"
            ].map((query, idx) => (
              <Button 
                key={idx} 
                variant="outline" 
                className="w-full justify-between text-left text-sm"
                onClick={() => setPrompt(query)}
              >
                {query}
                <ArrowRight size={14} />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Fix for the missing Clock and Music components
const Clock = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const Music = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
);

export default VenueGPT;
