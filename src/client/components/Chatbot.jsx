import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Send, Sparkles, Package, HelpCircle, Gift, Search, RotateCcw, Mail, Phone, ShoppingBag, User, CreditCard, Truck, Heart, ChevronRight, Home, X } from "lucide-react";

const socket = io(
  process.env.NODE_ENV === "production"
    ? "https://mustaab.onrender.com/chatbot"
    : "http://localhost:2000/chatbot"
);

export default function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.on("botMessage", (msg) => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { 
        sender: "bot", 
        text: msg.text, 
        timestamp: new Date() 
      }]);
      setOptions(msg.buttons || []);
    });

    return () => socket.off("botMessage");
  }, []);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    
    setMessages((prev) => [...prev, { 
      sender: "user", 
      text, 
      timestamp: new Date() 
    }]);
    setInputValue("");
    setOptions([]);
    setIsTyping(true);
    
    socket.emit("userMessage", text);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const getButtonIcon = (text) => {
    const iconMap = {
      "orders": <Package size={14} />,
      "support": <HelpCircle size={14} />,
      "offers": <Gift size={14} />,
      "account": <User size={14} />,
      "products": <ShoppingBag size={14} />,
      "shipping": <Truck size={14} />,
      "track order": <Search size={14} />,
      "return product": <RotateCcw size={14} />,
      "email us": <Mail size={14} />,
      "call support": <Phone size={14} />,
      "payment methods": <CreditCard size={14} />,
      "wishlist": <Heart size={14} />,
      "back to main menu": <Home size={14} />
    };
    return iconMap[text.toLowerCase()] || <ChevronRight size={14} />;
  };

  return (
    <div className="w-96 h-[600px] bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-scale-in">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-float"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-purple-400 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-pink-400 rounded-full animate-float"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="animate-spin-slow" size={24} />
            <div className="absolute inset-0 animate-ping opacity-75">
              <Sparkles size={24} />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg">Mustaab Assistant</h3>
            <p className="text-xs opacity-90">Always here to help ✨</p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:rotate-90"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 animate-slide-in ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
              msg.sender === "user" ? "bg-gradient-to-br from-blue-500 to-purple-500" : "bg-gradient-to-br from-pink-500 to-orange-500"
            }`}>
              {msg.sender === "user" ? "Y" : "M"}
            </div>
            <div
              className={`max-w-[70%] p-3 rounded-2xl shadow-md transform transition-all duration-300 hover:scale-105 ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-br-sm"
                  : "bg-white text-gray-800 rounded-bl-sm border border-gray-200"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-blue-100" : "text-gray-400"}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-end gap-2 animate-slide-in">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-500 to-orange-500 text-white text-xs font-bold">
              M
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-bl-sm shadow-md border border-gray-200">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Options */}
      {options.length > 0 && (
        <div className="px-4 pb-3 animate-slide-up">
          <div className="flex flex-wrap gap-2">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(opt)}
                className="group bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 text-gray-700 hover:text-white px-3 py-2 rounded-xl text-sm font-medium shadow-md border border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="group-hover:animate-pulse">{getButtonIcon(opt)}</span>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-200">
        <div className="flex gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-2 border-gray-300 focus:border-blue-500 rounded-2xl px-4 py-3 text-sm transition-all duration-300 focus:shadow-lg focus:outline-none"
            placeholder="Type your message..."
          />
          <button
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-2xl transition-all duration-300 hover:scale-110 disabled:scale-100 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #93c5fd;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}