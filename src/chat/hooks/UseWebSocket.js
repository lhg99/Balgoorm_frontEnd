import { useCallback, useEffect, useRef } from 'react';
import { useMessage } from '../MessageProvider.js';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import { useAuth } from '../../user/auth/AuthContext.js';
import SockJS from 'sockjs-client'

const UseWebSocket = () => {
  const { addMessage, setInputValue } = useMessage();
  const { fetchedUser } = useAuth();
  const stompClient = useRef(null);

  const connect = useCallback(() => {
    if (stompClient.current)
      return; // 이미 연결되어 있으면 중단
    
    const socket = new SockJS("https://k618de24a93cca.user-app.krampoline.com/chat");
    stompClient.current = Stomp.over(socket);
    console.log("socket :", socket);

    stompClient.current.connect({}, (frame) => {
      console.log("connected: ", frame);
      stompClient.current.subscribe("/sub/chat", (message) => {
        const messageBody = JSON.parse(message.body.trim());
        const {senderName, chatBody} = messageBody;
        const newMessage = {senderName: senderName.trim(), chatBody: chatBody.trim()};
        addMessage(newMessage);
        console.log("Added message: ", newMessage);
      });
    }, (error) => {
      console.error('Connection error: ', error);
    });
  }, [addMessage]);

  const joinChatRoom = useCallback(() => {
    if(stompClient.current && stompClient.current.connected && fetchedUser && fetchedUser?.nickname) {
      const chatMessage = {
        senderName: fetchedUser.nickname,
        chatBody: "입장하였습니다."
      };
      console.log("Joining chat room with message: ", chatMessage);
      stompClient.current.send("/pub/join", {}, JSON.stringify(chatMessage));
    }
  }, [fetchedUser]);

  const disconnect = useCallback(() => {
    if (stompClient.current) {
      stompClient.current.disconnect(() => {
        console.log("Disconnected");
      });
      stompClient.current = null;
    }
  }, []);

  // 이 부분 문제있음 이따가 확인하기
  const sendMessage = (inputValue) => {
    if (stompClient.current && stompClient.current.connected) {
      const senderName = fetchedUser.nickname;
      const chatMessage = {
        senderName,
        chatBody: inputValue
      };
      stompClient.current.send("/pub/chat", {}, JSON.stringify(chatMessage));
      console.log("Sending message: ", chatMessage);
      addMessage(chatMessage);
      setInputValue('');
    }
  };

  const fetchChatHistory = useCallback(async () => {
    try {
      const response = await axios.get('https://k618de24a93cca.user-app.krampoline.com/api/history');
      const chatHistory = response.data;
      console.log("Fetched chat history: ", chatHistory);

      chatHistory.forEach(message => {
        const [senderName, chatBody] = JSON.parse(message);
        const newMessage = {
          senderName: senderName.trim(), 
          chatBody: chatBody.trim(), 
          currentUser: fetchedUser.nickname === senderName.trim() 
        }
        console.log('Adding history message:', newMessage);
        addMessage(newMessage);;
      });
    } catch (error) {
      console.error('failed to fetch chat history', error);
    }  
  }, [addMessage, fetchedUser]);

  return { sendMessage, connect, disconnect, joinChatRoom, fetchChatHistory };
}

export default UseWebSocket;