import React, { useState } from 'react';

const ChatAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { text: 'AI response', sender: 'ai' }]);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI Chat</h1>
      <div className="bg-white p-4 rounded shadow h-96 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-l"
          placeholder="Ask a question..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded-r">Send</button>
      </div>
    </div>
  );
};

export default ChatAI;