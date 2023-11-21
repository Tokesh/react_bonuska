import React, { useState } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";

const MainPage = () => {
    const [selectedChatId, setSelectedChatId] = useState(null);

    return (
        <>
            <div style={{ display: 'flex', height: '100vh' }}>
                <div style={{ width: '25%', borderRight: '1px solid #ccc' }}>
                    <ChatList setSelectedChatId={setSelectedChatId} />
                </div>
                <div style={{ width: '75%' }}>
                    {selectedChatId && <ChatWindow selectedChatId={selectedChatId} />}

                </div>
            </div>
        </>
    );
}

export default MainPage;
