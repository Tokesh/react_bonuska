import React, { useState, useEffect } from 'react';

function ChatWindow({ selectedChatId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if(!selectedChatId) return;
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`http://localhost:3001/api/chats/${selectedChatId}/messages`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then(data => setMessages(data))
                .catch(error => console.error('Error fetching messages:', error));
        }
    }, [selectedChatId]);

    const sendMessage = () => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`http://localhost:3001/api/chats/${selectedChatId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: 1,
                    messageText: newMessage
                })
            })
                .then(response => response.json())
                .then(data => {
                    setMessages([...messages, data]);
                    setNewMessage('');
                })
                .catch(error => console.error('Error sending message:', error));
        }
    };

    return (
        <div>
            <h3>Chat Window</h3>
            {messages.map(message => (
                <p key={message.message_id}>{message.message_text}</p>
            ))}
            <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default ChatWindow;
