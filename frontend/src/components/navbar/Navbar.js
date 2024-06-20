import React from 'react';
import './Navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Board } from '../../img/BoardImg';
import { Logout } from '../../img/LogoutImg';
import { Login } from '../../img/LoginImg';
import { Mypage } from '../../img/MyPageImg';
import { Home } from '../../img/HomeImg';

function Navbar() {

  const location = useLocation();
  const navigate = useNavigate();
  const isLoginoOrSignupPage = location.pathname === '/login' || location.pathname === '/signup';
  const isMypage = location.pathname === '/mypage';

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/logout');
      localStorage.removeItem('token');
      navigate('/login')
    } catch (error) {
      console.error('로그아웃 실패', error); 
    }
  }

  return (
    <div className="navbar">
      <div className='d-flex'>
        <a className="nav-link" href='/'>
          <Home />
        </a>
        {isMypage && (
          <div className="ml-auto d-flex align-items-center">
            <a className="custom-link" href='/mypage'>내 정보</a>
            <a className="custom-link" href='/edit'>비밀번호 변경</a>
            <a className='custom-link' href='/delete'>회원 탈퇴</a>
          </div>
          )}
      </div>

      <div className="navmenu">
        <a href='/board'>
        <Board />
        </a>
        <a href="/mypage">
          <Mypage />
        </a>
        {isLoginoOrSignupPage ? (
          <a href="/login">
            <Login />
          </a>
          ) : (
          <Link onClick={handleLogout}>
            <Logout />
          </Link>
        )}
        
      </div>
    </div>
  );
}

export default Navbar;
