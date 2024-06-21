import { useCallback, useEffect, useRef } from 'react';
import { useMessage } from '../MessageProvider.js';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import { useAuth } from '../../user/auth/AuthContext.js';
import SockJS from 'sockjs-client'

const UseWebSocket = () => {
  const { addMessage, InputValue, setInputValue } = useMessage();
  const { user } = useAuth();
  const stompClient = useRef(null);

  const connect = useCallback(() => {
    const socket = new SockJS("http://localhost:8080/websocket");
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, (frame) => {
      console.log("connected: ", frame);
      stompClient.current.subscribe("/sub/chat", (message) => {
        const newMessage = JSON.parse(message.body);
        addMessage(newMessage);
      });
    }, (error) => {
      console.error('Connection error: ', error);
    });
  }, [addMessage]);

  const joinChatRoom = useCallback(() => {
    if(stompClient.current && stompClient.current.connected && user && user?.nickname) {
      const chatRequest = { senderName: user?.nickname, chatBody: '입장하였습니다.'};
      stompClient.current.send("pub/join", {}, JSON.stringify(chatRequest));
    }
  }, [user]);

  const disconnect = useCallback(() => {
    if (stompClient.current) {
      stompClient.current.disconnect(() => {
        console.log("Disconnected");
      });
    }
  }, []);

  const sendMessage = (inputValue) => {
    if (stompClient.current && stompClient.current.connected && inputValue.trim() !== '') {
      const senderName = user.nickname;
      const chatTime = new Date().toISOString();      

      const chatMessage = {
        senderName,
        chatBody: InputValue,
        chatTime,
        currentUser: true
      };

      stompClient.current.send("/pub/chat", {}, JSON.stringify(chatMessage));
      
      addMessage(chatMessage);
      setInputValue('');
    }
  };

  const fetchChatHistory = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/history');
      const chatHistory = response.data;
      chatHistory.forEach(message => addMessage(message))
    } catch (error) {
      console.error('failed to fetch chat history', error);
    }  
  }, [addMessage]);

  // 연결을 생성하고 해제하는 로직
  useEffect(() => {
    if(user && user.nickname) {
      fetchChatHistory();
      connect();
      joinChatRoom();
    }
    return () => {
      disconnect();
    };
  }, [user, connect, fetchChatHistory, joinChatRoom, disconnect]);

  return { sendMessage };
}

export default UseWebSocket;
