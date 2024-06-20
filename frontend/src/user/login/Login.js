/**
 * 로그인 페이지
 * 아이디 찾기, 비밀번호 변경 시간되면 만들기
 * 쿠키로 토큰 관리하기
 * 로그인을 해야 마이페이지 접근 가능하게 설정
 * 관리자 계정으로 로그인하면 관리자 페이지 접근 가능하게 설정
 */

import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate} from 'react-router-dom';
import logo1 from "../../img/Logo1.png";
import { useAuth } from '../auth/AuthContext.js';
import './Login.css';

function Login() {
    const { register, handleSubmit, formState: {errors} } = useForm();
    const navigate = useNavigate();
    const { setAuthToken, setUserRole } = useAuth();

    const submitForm = async (data) => {
      console.log(data);
      const { userId, password }  = data;

      try {
        const response = await axios.post('http://localhost:8080/login', data);
        const { token, role } = response.data;

        setAuthToken(token);
        setUserRole(role);
        role === "ADMIN" ? navigate('/admin') : navigate('/mypage');
      }
      catch(error) {
        if(error.response) {
          alert(error.response.data);
        } else {
          alert("로그인 실패");
        }
        
      }  
    }
    
    return (
    <div>      
      <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <div className="text-center mb-4">
          <img src={logo1} alt="BalGoorm Logo" className="logo-img" />
          <h1 className="logo-text mt-2">BalGoorm</h1>
        </div>
        
        <Form onSubmit={handleSubmit(submitForm)} className="login-form w-100">
          <Form.Group>
            <Form.Label htmlFor='id'>아이디</Form.Label>
            <Form.Control 
            id="id" 
            type="text" 
            placeholder="id 입력" 
            aria-label='아이디'
            {...register("id", {required: "아이디를 입력해주세요"})} />
          </Form.Group>
          {errors.id && <div className='error-message'>{errors.id.message}</div>}
          <br />
          
          <Form.Group>
            <Form.Label htmlFor='password'>비밀번호</Form.Label>
            <Form.Control 
            id='password' 
            type="password" 
            placeholder="비밀번호 입력" 
            aria-label='비밀번호' 
            {...register("password", {required: "비밀번호를 입력하세요"})}/>
          </Form.Group>
          {errors.password && <div className='error-message'>{errors.password.message}</div>}

          <Button variant="primary" type="submit" className="w-100 mt-4" aria-label='로그인 버튼'>
            로그인
          </Button>
        </Form>
        
        <div className="mt-3">
          <p>회원이 아니신가요? <a href="signup">회원가입</a></p>
          <p>아이디를 까먹으셨나요? <a href="find">아이디 찾기</a></p>
          <p>비밀번호를 까먹으셨나요? <a href="edit">비밀번호 변경</a></p>
        </div>    
      </Container>
    </div>
  );
}

export default Login;