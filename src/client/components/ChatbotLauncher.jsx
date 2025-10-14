import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import Chatbot from "./Chatbot";

export default function ChatbotLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-4">
          <Chatbot onClose={() => setOpen(false)} />
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className={`group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white p-5 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 ${
          open ? "rotate-90" : ""
        }`}
      >
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></div>
        
        {/* Icon */}
        <div className="relative z-10 transition-transform duration-300">
          {open ? <X size={28} /> : <MessageCircle size={28} />}
        </div>
        
        {/* Badge - Optional: shows unread count */}
        {!open && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
            1
          </div>
        )}

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300"></div>
      </button>
    </div>
  );
}