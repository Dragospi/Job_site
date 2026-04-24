import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import './Chatbot.css';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! How can I help you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const userMessage = inputText.trim().toLowerCase();
    const newMessages = [...messages, { from: 'user', text: inputText }];
    setMessages(newMessages);
    setInputText('');

    // Command logic
    let botResponse = 'Sorry, I can only understand a few commands right now. Try "logout" or "find IT jobs".';

    if (userMessage === 'logout') {
      botResponse = 'Logging you out...';
      setTimeout(() => {
        // Perform logout
        localStorage.removeItem("user");
        localStorage.removeItem("employerUser");
        dispatch(logout());
        navigate("/");
      }, 1500);
    } else if (userMessage.includes('hello') || userMessage.includes('hi')) {
      botResponse = 'Hello there! How can I assist you?';
    } else if (userMessage.includes('thank')) {
      botResponse = "You're welcome!";
    } else if (userMessage.startsWith('find') || userMessage.startsWith('show me')) {
      const parts = userMessage.split(' ');
      const category = parts.find(part => ['it', 'remote', 'fresher', 'part-time', 'all'].includes(part));

      if (category) {
        botResponse = `Sure, navigating you to ${category} jobs...`;
        navigate(`/jobs/${category.charAt(0).toUpperCase() + category.slice(1)}`);
      } else {
        botResponse = "I can find jobs by category. Try 'find IT jobs' or 'show me all jobs'.";
      }
    }

    // Add bot response
    setTimeout(() => {
      setMessages([...newMessages, { from: 'bot', text: botResponse }]);
    }, 1000);
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle-btn" onClick={toggleChat}>
        {isOpen ? '✖' : '🤖'}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>AI Assistant</h3>
          </div>
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.from}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;