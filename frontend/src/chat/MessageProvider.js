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
        { id: 1, nickname: 'user1', message: "hello, i'm user1", currentUser: false},
        { id: 2, nickname: 'user2', message: "hi, this is test data", currentUser: true}
    ]);
    
    const addMessage = useCallback((newMessage) => {
        setMessage(prevMessage => [...prevMessage, newMessage])
    }, [setMessage]);

    const handleSendMessage = useCallback(() => {
        if (inputValue.trim() !== '') {
            const newMessage = {
                id: message.length + 1,
                nickname: user ? user.nickname : 'annoymous' ,
                message: inputValue,
                currentUser: true
            };
            addMessage(newMessage);
            sendMessage(inputValue);
            setInputValue('');
        }
    }, [inputValue, message.length, sendMessage, addMessage, setInputValue, user])

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };
    
    return (
    <MessageContext.Provider value={{ message, addMessage, handleKeyDown, inputValue, setInputValue }}>
        {children}
    </MessageContext.Provider>
    );
};

export const useMessage = () => useContext(MessageContext);
