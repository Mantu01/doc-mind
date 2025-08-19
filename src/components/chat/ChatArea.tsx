

import React, { useState } from 'react'
import { MessageCircle, Send, Bot, User, Clock } from 'lucide-react'

interface Message {
  type: 'ai' | 'user'
  message: string
  timestamp: string
}

const ChatArea: React.FC = () => {

  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      type: 'ai',
      message: 'Welcome to DocMind! I\'m ready to help you synthesize information and refine your ideas. Upload documents or start a conversation.',
      timestamp: '10:30 AM'
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      const newMessage: Message = {
        type: 'user',
        message: currentMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setChatMessages([...chatMessages, newMessage])
      setCurrentMessage('')
      
      setTimeout(() => {
        const aiResponse: Message = {
          type: 'ai',
          message: 'I understand your request. Let me process that information and provide you with a comprehensive analysis.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setChatMessages(prev => [...prev, aiResponse])
      }, 1000)
    }
  }
  return (
    <div className="w-2/3 flex flex-col">
      {/* Chat Header */}
      <div className="border-b border-gray-800 p-4 lg:p-6">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-500" />
          <h2 className="text-lg lg:text-xl font-semibold">Conversation</h2>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 min-h-0">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start space-x-2 lg:space-x-3 ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.type === 'ai' ? 'bg-red-500' : 'bg-gray-700'
            }`}>
              {msg.type === 'ai' ? (
                <Bot className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              ) : (
                <User className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              )}
            </div>
            <div className={`flex-1 ${msg.type === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block max-w-[90%] lg:max-w-[80%] p-3 lg:p-4 rounded-lg ${
                msg.type === 'ai' 
                  ? 'bg-gray-900 border border-red-500/20' 
                  : 'bg-gray-800'
              }`}>
                <p className="text-xs lg:text-sm text-white leading-relaxed">{msg.message}</p>
              </div>
              <div className={`flex items-center space-x-1 mt-1 text-xs text-gray-500 ${
                msg.type === 'user' ? 'justify-end' : ''
              }`}>
                <Clock className="w-2 h-2 lg:w-3 lg:h-3" />
                <span className="text-xs">{msg.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 p-4 lg:p-6">
        <div className="flex items-center space-x-2 lg:space-x-3">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask DocMind..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
          />
          <button
            onClick={handleSendMessage}
            className="bg-red-500 hover:bg-red-600 text-white p-2 lg:p-3 rounded-lg transition-colors flex items-center justify-center"
          >
            <Send className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatArea