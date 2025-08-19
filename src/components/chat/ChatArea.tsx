'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Bot, User, Sparkles, Zap } from 'lucide-react'
import MarkdownPreview from '../ui/markdownPreview'

interface Message {
  role: 'assistant' | 'user' | 'system'
  content: string
}

const ChatArea: React.FC = () => {
   const [userProvidePrompt, setUserProvidePrompt] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('system-prompt') || 'Your are a helpful AI assitent';
    setUserProvidePrompt(stored);
  }, []);

  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      role:'system',
      content: userProvidePrompt
    },
    {
      role: 'assistant',
      content: 'Welcome to **DocMind**! ✨\n\nI\'m your AI assistant, ready to help you synthesize information, analyze documents, and refine your ideas with precision.\n\n*How can I assist you today?*'
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const handleSendMessage = async () => {
  if (!currentMessage.trim()) return;

  // push user message immediately
  const newMessage: Message = {
    role: 'user',
    content: currentMessage
  };
  const updatedMessages = [...chatMessages, newMessage];
  setChatMessages(updatedMessages);
  setCurrentMessage('');
  setIsTyping(true);

  const apiKey = localStorage.getItem('openai');

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey,
        messages: updatedMessages 
      }),
    });

    if (!res.body) throw new Error('Response body is null');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let assistantMessage = ''; // buffer for assistant response

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      // SSE sends multiple "data:" lines per chunk, split them
      const lines = chunk.split('\n\n');
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = JSON.parse(line.replace(/^data:\s*/, ''));
          if (data.content) {
            assistantMessage += data.content;

            // Update UI live (replace last assistant message)
            setChatMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === 'assistant') {
                return [
                  ...prev.slice(0, -1),
                  { ...last, content: assistantMessage }
                ];
              } else {
                return [
                  ...prev,
                  {
                    role: 'assistant',
                    content: assistantMessage
                  }
                ];
              }
            });
          }
        }
      }
    }

    setIsTyping(false);
  } catch (error) {
    console.error('Error sending message:', error);
    setIsTyping(false);
  }
};


  return (
    <div className="w-2/3 flex flex-col bg-black min-h-screen scale-90">
      <div className="bg-gradient-to-r from-black via-gray-950 to-black border-b border-red-900/20 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5"></div>
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-24 h-24 bg-red-600/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        <div className="relative flex items-center space-x-5 p-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl opacity-75 group-hover:opacity-100 blur-sm transition-all duration-300"></div>
            <div className="relative w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/30 group-hover:scale-105 transition-all duration-300">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-black shadow-lg animate-pulse">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent tracking-tight">
                Conversation
              </h2>
              <div className="flex items-center space-x-1">
                <Sparkles className="w-5 h-5 text-red-400 animate-pulse" />
                <Zap className="w-4 h-4 text-yellow-400 animate-bounce delay-200" />
              </div>
            </div>
            <p className="text-sm text-gray-400 font-medium flex items-center space-x-2">
              <span>DocMind AI Assistant</span>
              <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-green-400">Online</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 min-h-0 bg-gradient-to-b from-black via-gray-950 to-black relative scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-800 hover:scrollbar-thumb-gray-700">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.1)_0%,transparent_70%)] pointer-events-none"></div>
        
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start space-x-6 animate-fade-in ${index===0?'hidden':''} ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`relative flex-shrink-0 group ${msg.role === 'user' ? 'ml-6' : 'mr-6'}`}>
              <div className={`absolute inset-0 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-all duration-500 ${
                msg.role === 'assistant' 
                  ? 'bg-gradient-to-br from-red-500 to-red-600' 
                  : 'bg-gradient-to-br from-gray-600 to-gray-700'
              }`}></div>
              <div className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 ${
                msg.role === 'assistant' 
                  ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/40' 
                  : 'bg-gradient-to-br from-gray-700 to-gray-800 shadow-gray-700/40'
              }`}>
                {msg.role === 'assistant' ? (
                  <Bot className="w-6 h-6 text-white" />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              {msg.role === 'assistant' && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            
            <div className={`flex-1 max-w-[82%] ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className={`relative group ${msg.role === 'user' ? 'ml-auto' : ''}`}>
                <div className={`absolute inset-0 rounded-3xl blur-sm opacity-30 group-hover:opacity-50 transition-all duration-500 ${
                  msg.role === 'assistant' 
                    ? 'bg-gradient-to-br from-red-500/20 to-red-600/20' 
                    : 'bg-gradient-to-br from-gray-700/20 to-gray-800/20'
                }`}></div>
                
                <div className={`relative backdrop-blur-xl rounded-3xl transition-all duration-500 group-hover:scale-[1.02] shadow-2xl ${
                  msg.role === 'assistant' 
                    ? 'bg-gradient-to-br from-gray-900/90 via-black/90 to-gray-900/90 border border-red-500/20 shadow-red-500/10 hover:border-red-500/30 hover:shadow-red-500/20' 
                    : 'bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-gray-800/90 border border-gray-600/20 shadow-gray-700/10 hover:border-gray-500/30 hover:shadow-gray-700/20'
                } p-6`}>
                  
                  <div className="relative z-10">
                    <MarkdownPreview 
                      markdown={msg.content}
                      className="text-white font-medium leading-relaxed"
                    />
                  </div>
                  
                  <div className={`absolute top-3 ${msg.role === 'user' ? 'left-3' : 'right-3'} opacity-20`}>
                    <div className={`w-16 h-16 rounded-full ${
                      msg.role === 'assistant' 
                        ? 'bg-gradient-to-br from-red-500/30 to-red-600/30' 
                        : 'bg-gradient-to-br from-gray-600/30 to-gray-700/30'
                    } blur-xl`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start space-x-6 animate-fade-in">
            <div className="relative flex-shrink-0 group mr-6">
              <div className="absolute inset-0 rounded-full blur-md opacity-50 bg-gradient-to-br from-red-500 to-red-600"></div>
              <div className="relative w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-500/40">
                <Bot className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1 max-w-[82%]">
              <div className="relative group">
                <div className="absolute inset-0 rounded-3xl blur-sm opacity-30 bg-gradient-to-br from-red-500/20 to-red-600/20"></div>
                <div className="relative backdrop-blur-xl rounded-3xl bg-gradient-to-br from-gray-900/90 via-black/90 to-gray-900/90 border border-red-500/20 p-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span className="text-gray-400 text-sm font-medium">AI is analyzing...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-gradient-to-r from-black via-gray-950 to-black border-t border-red-900/20 p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/3 via-transparent to-red-500/3"></div>
        <div className="absolute bottom-0 left-1/3 w-40 h-20 bg-red-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-black/90 to-gray-900/80 rounded-3xl blur-sm group-hover:blur-md transition-all duration-500"></div>
            <div className="relative flex items-center space-x-4 bg-gradient-to-r from-gray-900/60 via-black/80 to-gray-900/60 rounded-3xl p-1 border border-gray-800/50 backdrop-blur-xl shadow-2xl shadow-black/50 group-hover:border-red-500/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <input
                ref={inputRef}
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Share your thoughts with DocMind..."
                className="flex-1 bg-transparent px-6 py-4 text-white placeholder-gray-500 focus:outline-none text-base font-medium focus:placeholder-gray-400 transition-all duration-300 relative z-10"
                disabled={isTyping}
              />
              
              <div className="flex items-center space-x-3 relative z-10">
                <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent"></div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isTyping}
                  className="relative group/btn bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-700 disabled:to-gray-800 text-white p-4 rounded-2xl transition-all duration-500 flex items-center justify-center shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400/50 to-red-600/50 opacity-0 group-hover/btn:opacity-100 animate-pulse"></div>
                  
                  {isTyping ? (
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-100"></div>
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-200"></div>
                    </div>
                  ) : (
                    <Send className="w-5 h-5 relative z-10 group-hover/btn:rotate-12 transition-transform duration-300" />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-red-300/20 to-red-500/20 rounded-2xl opacity-0 group-hover/btn:opacity-100 blur-xl transition-all duration-500"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thumb-gray-800::-webkit-scrollbar-thumb {
          background: rgba(31, 41, 55, 0.8);
          border-radius: 3px;
        }
        
        .scrollbar-thumb-gray-800:hover::-webkit-scrollbar-thumb {
          background: rgba(55, 65, 81, 0.9);
        }
      `}</style>
    </div>
  )
}

export default ChatArea