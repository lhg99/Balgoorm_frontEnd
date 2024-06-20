import React, { createContext, useCallback, useContext, useState } from 'react';
import UseWebSocket from './hooks/UseWebSocket';
import { useAuth } from '../user/auth/AuthContext';

const MessageContext = createContext({
    message: [],
    addMessage: () => {}
});

export const MessageProvider = ({ children }) => {

    const { user } = useAuth();
    const { sendMessage } = UseWebSocket();
    const [inputValue, setInputValue] = useState(''); // 사용자 입력 저장 변수
    const [message, setMessage] = useState([
        { chatId: 1, senderName: 'user1', chatBody: "hello, i'm user1", chatTime: new Date().toISOString(), urrentUser: false},
        { chatId: 2, senderName: 'user2', chatBody: "hi, this is test data", chatTime: new Date().toISOString(), currentUser: true}
    ]);
    
    const addMessage = useCallback((newMessage) => {
        setMessage(prevMessage => [...prevMessage, newMessage])
    }, [setMessage]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };
    
    return (
    <MessageContext.Provider value={{ message, addMessage, handleKeyDown, inputValue, setInputValue }}>
        {children}
    </MessageContext.Provider>
    );
};

export const useMessage = () => useContext(MessageContext);
