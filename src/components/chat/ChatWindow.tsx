import React, { useState } from 'react';
import type { Chat } from '../../types';
import Send from "../../assets/Send";

interface ChatWindowProps {
  chat: Chat;
}

const ChatWindow = ({ chat }: ChatWindowProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="flex items-center space-x-3">
          <img
            src={chat.participants[0].avatar}
            alt={chat.participants[0].name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-medium">{chat.participants[0].name}</h2>
            <p className="text-sm text-gray-500">
              {chat.isGroup ? 'Group Chat' : 'Private Chat'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender.id === '1' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.sender.id === '1'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <p>{msg.content}</p>
              <span className="text-xs text-gray-400 mt-1 block">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border-gray-300 focus:ring-gray-500 focus:border-gray-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            className="p-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;