import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import './aichat.css';
import InternalAppShell from '../layout/InternalAppShell.jsx';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('optimos_openai_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem('optimos_openai_key'));
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    if (!apiKey) {
      alert('Please enter your OpenAI API key first');
      return;
    }

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: inputValue }],
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = {
        id: Date.now() + 1,
        text: data.choices[0].message.content,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please check your API key and try again.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('optimos_openai_key', apiKey.trim());
      setShowApiKeyInput(false);
    }
  };

  if (showApiKeyInput) {
    return (
      <InternalAppShell title="AI Chat" activeNav="aichat">
        <div className="chat-key-screen">
          <div className="chat-key-card">
            <h2>Enter OpenAI API Key</h2>
            <p>
              You need an OpenAI API key to use this chat app. Get one from{' '}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                OpenAI's website
              </a>
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="chat-key-input"
            />
            <button
              onClick={saveApiKey}
              className="chat-key-submit"
            >
              Start Chatting
            </button>
          </div>
        </div>
      </InternalAppShell>
    );
  }

  return (
    <InternalAppShell title="AI Chat" activeNav="aichat">
      <div className="chat-app">
        <div className="chat-header">
          <div className="chat-header__inner">
            <h1>AI Strategy Assistant</h1>
            <button
              onClick={() => setShowApiKeyInput(true)}
              className="chat-header__btn"
            >
              Change API Key
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-empty">
              <Bot className="chat-empty__icon" />
              <p>Start a conversation with ChatGPT!</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-row ${message.sender === 'user' ? 'chat-row--user' : 'chat-row--bot'}`}
            >
              <div
                className={`chat-bubble ${
                  message.sender === 'user'
                    ? 'chat-bubble--user'
                    : 'chat-bubble--bot'
                }`}
              >
                <div className="chat-bubble__inner">
                  {message.sender === 'bot' && (
                    <Bot className="chat-icon" />
                  )}
                  <div className="chat-content">
                    <p className="chat-content__text">{message.text}</p>
                    <p className={`chat-content__time ${
                      message.sender === 'user' ? 'chat-content__time--user' : 'chat-content__time--bot'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <User className="chat-icon" />
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="chat-row chat-row--bot">
              <div className="chat-bubble chat-bubble--bot">
                <div className="chat-bubble__inner">
                  <Bot className="chat-icon" />
                  <div className="chat-loader" aria-label="Assistant is typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-wrap">
          <div className="chat-input-row">
            <div className="chat-input-box">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="chat-textarea"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={`chat-send ${
                inputValue.trim() && !isLoading
                  ? 'chat-send--active'
                  : 'chat-send--disabled'
              }`}
            >
              <Send />
            </button>
          </div>
        </div>
      </div>
    </InternalAppShell>
  );
};

export default ChatApp;