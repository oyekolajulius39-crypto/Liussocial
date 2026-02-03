import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Messages.css';

const API_BASE = 'https://liussocial.onrender.com/api';

function Messages({ currentUser }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.partner.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_BASE}/messages/conversations/${currentUser.id}`);
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (partnerId) => {
    try {
      const response = await axios.get(`${API_BASE}/messages/${currentUser.id}/${partnerId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      const formData = new FormData();
      formData.append('senderId', currentUser.id);
      formData.append('receiverId', selectedConversation.partner.id);
      formData.append('content', messageText);
      formData.append('anonymous', 'false');

      await axios.post(`${API_BASE}/messages`, formData);
      setMessageText('');
      fetchMessages(selectedConversation.partner.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="messages-container">
      <div className="conversations-list">
        <h3>Messages</h3>
        {conversations.map(conv => (
          <div
            key={conv.partner.id}
            className={`conversation-item ${selectedConversation?.partner.id === conv.partner.id ? 'active' : ''}`}
            onClick={() => setSelectedConversation(conv)}
          >
            <img
              src={`http://localhost:5000${conv.partner.profilePicture}`}
              alt={conv.partner.username}
              className="conv-avatar"
            />
            <div className="conv-info">
              <div className="conv-name">{conv.partner.username}</div>
              <div className="conv-last-msg">
                {conv.lastMessage?.content || 'No messages'}
              </div>
            </div>
            {conv.unreadCount > 0 && (
              <div className="unread-badge">{conv.unreadCount}</div>
            )}
          </div>
        ))}
      </div>

      {selectedConversation ? (
        <div className="chat-area">
          <div className="chat-header">
            <img
              src={`http://localhost:5000${selectedConversation.partner.profilePicture}`}
              alt={selectedConversation.partner.username}
              className="chat-avatar"
            />
            <h3>{selectedConversation.partner.username}</h3>
          </div>

          <div className="messages-list">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`message ${msg.senderId === currentUser.id ? 'sent' : 'received'}`}
              >
                <div className="message-bubble">{msg.content}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="message-input-form">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="message-input"
            />
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      ) : (
        <div className="no-conversation">
          <i className="fas fa-comments"></i>
          <p>Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
}

export default Messages;
