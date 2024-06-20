/**
 * 채팅 페이지
 * STOMP 라이브러리로 연결
 * 화면 구현 해야됨
 * 채팅하는 인원 수 해보기
 */

import React, { useCallback } from 'react'
import { Button, Container, Form } from 'react-bootstrap';
import { useMessage } from './MessageProvider';
import './Chat.css'

function Chat({sendMessage}) {
  const { message, addMessage, handleKeyDown, inputValue, setInputValue} = useMessage();

  const ssssendMessage = useCallback(() => {
    if (inputValue.trim() !== '') {
      // 임시로 로컬 메시지 객체 생성
      const newMessage = {
        chatId: Date.now(),
        senderName: 'lee99',
        chatBody: inputValue,
        chatTime: new Date().toISOString(),
        currentUser: true
      };
      addMessage(newMessage); // 메시지 리스트에 추가
      setInputValue(''); // 입력 필드 초기화
    }
  }, [inputValue, addMessage, setInputValue]);
  
  return (
  <div>
    <Container className='chatting-container'>
      {message.map((msg) => (
        <div className={`message-box ${msg.currentUser ? 'right' : 'left'}`} key={msg.chatId}>
          {msg.currentUser ? (
            <>
              <div className='message-content'>{msg.chatBody}</div>
              <span className='user-badge'>{msg.senderName}</span>
            </>
          ) : (
            <>
              <span className='user-badge'>{msg.senderName}</span>
              <div className='message-content'>{msg.chatBody}</div>
            </>
          )}
        </div>
      ))}
      <Form className='chatting-form mt-3'>
        <Form.Group className="mb-3 form-group-inline" controlId="chatMessageInput">
          <Form.Control className='form-control-inline'
          type="text" 
          placeholder="메시지 입력" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} 
          onKeyDown={handleKeyDown} 
          />
          </Form.Group>
          <Button variant="primary" className='button-inline' onClick={ssssendMessage}>전송</Button>
      </Form>
    </Container> 
  </div>
  )
}

export default Chat;