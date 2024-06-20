import { useEffect, useRef } from 'react';
import { useMessage } from '../MessageProvider.js';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';

function UseWebSocket() {
  const { addMessage, setInputValue } = useMessage();
  const stompClient = useRef(null);

  const connect = () => {
    const socket = new WebSocket("ws://localhost:8080/chat");
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, () => {
      stompClient.current.subscribe("/sub/chat", (message) => {
        const newMessage = JSON.parse(message.body);
        addMessage(newMessage);
      });
    }, (error) => {
      console.error('Connection error: ', error);
    });
  };

  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.disconnect();
      console.log("Disconnected");
    }
  };

  const sendMessage = (nickname, message) => {
    if (stompClient.current && message.trim() !== '') {
      stompClient.current.send("/pub/chat", {}, JSON.stringify({ nickname, message }));
      
      const newMessage = {
        id: Date.now(),
        nickname,
        message
      };
      addMessage(newMessage);
      setInputValue('');
    }
  };

  const fetchMessage = async () => {
    return await axios.get('http://localhost:8080/chat/1')
    .then(response => {
      addMessage(response.data);
    });
  };

  // 연결을 생성하고 해제하는 로직
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  return { sendMessage, fetchMessage };
}

export default UseWebSocket;
