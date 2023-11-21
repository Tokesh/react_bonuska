import React, { useState, useEffect } from 'react';

function ChatList({ setSelectedChatId }) {
    const [newChatName, setNewChatName] = useState('');

    const [chats, setChats] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:3001/api/chats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then(data => setChats(data))
                .catch(error => console.error('Error fetching chats:', error));
        }
    }, []);
    const createChat = () => {
        const token = localStorage.getItem('token');
        if (token && newChatName) {
            fetch('http://localhost:3001/api/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ chatName: newChatName })
            })
                .then(response => response.json())
                .then(data => {
                    setChats([...chats, data]);
                    setNewChatName('');
                })
                .catch(error => console.error('Error creating chat:', error));
        }
    };

    const handleChatClick = (chatId) => {
        setSelectedChatId(chatId);
    };

    return (
        <div>
            <h3>Chats</h3>
            <ul>
                {chats.map(chat => (
                    <li key={chat.chat_id} onClick={() => handleChatClick(chat.chat_id)}>
                        {chat.chat_name}
                    </li>
                ))}
            </ul>
            <div>
                <input
                    type="text"
                    placeholder="New Chat Name"
                    value={newChatName}
                    onChange={(e) => setNewChatName(e.target.value)}
                />
                <button onClick={createChat}>Create Chat</button>
            </div>
        </div>
    );

}

export default ChatList;
