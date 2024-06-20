import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { useMessage } from '../../chat/MessageProvider';
import { ChatIcon } from '../../img/ChatIcon';

function Sidebar() {
  const location = useLocation();
  const { message } = useMessage();
  const isAdminPage = location.pathname === '/admin';
  const isNotChatPage = location.pathname !== '/chat';

  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <div className="dashboard">
          Dashboard 
          {/* 이미지? 수정필요 */}
        </div>
        <br />
        <ul>
          <li><Link to="/">메인 화면</Link></li>
          <li><Link to="/quizlist">문제 풀기</Link></li>
          <li><Link to="/editortest">테스트용 IDE</Link></li>
          <li><Link to="/editor">질의응답 게시판</Link></li>
          <li><Link to="/editor">Test Menu</Link></li>
          <li><Link to="/editor">Test Menu</Link></li>
          {isAdminPage && (
            <div className="admin-menu">
              <li><Link to="/admin">관리자 메뉴</Link></li>
              <li><Link to="/delete">삭제 메뉴</Link></li>
            </div>
          )}
        </ul>

        {isNotChatPage && (
          <div className="chat-wrapper">
            <div className="chat-container">
              <div className="chat-header">
                채팅헤더
                <div className='header-right'>
                  <a href='/chat'>
                    <ChatIcon />
                  </a>
                </div>
              </div>
              <div className='chat-message-div'>
                {message.map(chat => (
                  <div key={chat.id} className='chat-message'>
                    <strong>{chat.nickname}</strong>: {chat.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;