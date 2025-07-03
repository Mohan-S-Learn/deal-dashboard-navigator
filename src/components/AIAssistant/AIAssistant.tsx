import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Lightbulb, FileText, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAssistantProps {
  dealData?: {
    scope: string;
    duration: number;
    resources: number;
    complexity: number;
    price: number;
  };
  onSuggestionApply?: (suggestion: any) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ dealData, onSuggestionApply }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI pricing assistant. I can help you with pricing strategies, margin optimization, and document generation. How can I assist you today?',
      timestamp: new Date(),
      suggestions: [
        'Suggest pricing strategy',
        'Optimize margins',
        'Generate proposal'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: 'Pricing Strategy', icon: TrendingUp, prompt: 'What pricing strategy would you recommend for this project?' },
    { label: 'Margin Analysis', icon: Lightbulb, prompt: 'How can I optimize the margins for better profitability?' },
    { label: 'Generate Proposal', icon: FileText, prompt: 'Generate a professional proposal for this deal' }
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('pricing strategy') || lowerMessage.includes('strategy')) {
      return `Based on your project details, I recommend a value-based pricing strategy. With ${dealData?.complexity || 5}/10 complexity and ${dealData?.duration || 12} months duration, consider:

• **Tiered Pricing**: Offer basic, premium, and enterprise tiers
• **Performance-based**: Include success bonuses for early delivery
• **Risk-adjusted**: Add 10-15% buffer for high complexity projects

Your current price of $${dealData?.price?.toLocaleString() || '500,000'} appears competitive. Consider offering a 5% discount for upfront payment.`;
    }
    
    if (lowerMessage.includes('margin') || lowerMessage.includes('optimize') || lowerMessage.includes('profit')) {
      return `For margin optimization on your ${dealData?.scope || 'project'}:

• **Current Analysis**: Your ${dealData?.resources || 10} resources over ${dealData?.duration || 12} months
• **Resource Efficiency**: Consider reducing by 1-2 resources with automation
• **Scope Optimization**: Bundle additional services for 15-20% margin boost
• **Timeline Compression**: Faster delivery can justify 10-15% premium

Recommended margin range: 25-35% for sustainable profitability.`;
    }
    
    if (lowerMessage.includes('proposal') || lowerMessage.includes('document') || lowerMessage.includes('generate')) {
      return `I'll help you generate a professional proposal. Here's the structure I recommend:

**Executive Summary**
- Project scope: ${dealData?.scope || 'Digital Transformation'}
- Duration: ${dealData?.duration || 12} months
- Investment: $${dealData?.price?.toLocaleString() || '500,000'}

**Key Sections to Include:**
1. Problem Statement & Solution
2. Methodology & Approach  
3. Timeline & Milestones
4. Resource Allocation
5. Risk Mitigation
6. Investment & ROI

Would you like me to generate the full proposal content?`;
    }
    
    return `I understand you're asking about "${userMessage}". Based on your project details, here are some insights:

• **Project Scope**: ${dealData?.scope || 'Current project'}
• **Complexity Level**: ${dealData?.complexity || 5}/10
• **Resource Allocation**: ${dealData?.resources || 10} team members
• **Timeline**: ${dealData?.duration || 12} months

Is there a specific aspect you'd like me to elaborate on? I can provide detailed recommendations for pricing, margins, or documentation.`;
  };

  const handleSendMessage = (message: string = inputValue) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(message),
        timestamp: new Date(),
        suggestions: [
          'Tell me more',
          'Generate document',
          'Alternative approach'
        ]
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const MessageBubble = ({ message }: { message: Message }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {message.type === 'ai' && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-last' : ''}`}>
        <div
          className={`p-3 rounded-lg ${
            message.type === 'user'
              ? 'bg-primary text-primary-foreground ml-auto'
              : 'bg-muted'
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
        
        {message.suggestions && message.type === 'ai' && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage(suggestion)}
                className="text-xs hover:bg-primary/10"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {message.type === 'user' && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-[600px] border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Bot className="h-5 w-5" />
            AI Pricing Assistant
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0 h-full flex flex-col">
          {/* Quick Actions */}
          <div className="p-4 border-b bg-muted/30">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMessage(action.prompt)}
                    className="flex items-center gap-2 hover:bg-primary/10"
                  >
                    <action.icon className="h-3 w-3" />
                    {action.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map(message => (
                <MessageBubble key={message.id} message={message} />
              ))}
              
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about pricing strategies, margins, or document generation..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};