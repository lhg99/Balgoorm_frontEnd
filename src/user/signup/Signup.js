/**
 * 회원가입 소스코드
 */

import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Button, Container, Form } from "react-bootstrap";
import logo1 from "../../img/Logo1.png";
import './Signup.css'

function Signup() {

  const { register, watch, handleSubmit, formState: {errors} } = useForm();

  const submitForm = async (data) => {
    console.log(data);
    const { userId, nickname, email, password } = data;

    // api 호출 로직
    try {
      const response = await axios.post('localhost:8080/signup', data);
          }
          catch(error) {
            if(error.response) {
              alert(error.response.data);
            } else {
              alert("회원가입 실패")
            }
            
          }
  }
  
  return (
  <div>
    <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="text-center mb-4">
        <img src={logo1} alt="BalGoorm Logo" className="logo-img" />
        <h1 className="mt-2 logo-text">BalGoorm</h1>
      </div>
      
      <Form onSubmit={handleSubmit(submitForm)} className="w-100 signup-form" >
        <Form.Group>
          <Form.Label>아이디</Form.Label>
          <Form.Control type="text" placeholder="id 입력" {...register("id", {required: "아이디를 입력해주세요"})} />
        </Form.Group>
        {errors.id && <div className='error-message'>{errors.id.message}</div>}
        <br />
        
        <Form.Group>
          <Form.Label>닉네임</Form.Label>
          <Form.Control type="text" placeholder="닉네임 입력" 
          {...register("nickname", 
          {required: "닉네임을 입력해주세요."})} />
        </Form.Group>
        {errors.nickname && <div className="error-message">{errors.nickname.message}</div>}
        <br />

        <Form.Group>
          <Form.Label>이메일</Form.Label>
          <Form.Control type="text" placeholder="이메일 입력" {
            ...register("email", {
              required: "이메일을 입력해주세요.", 
              pattern: {
                value: /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
                message: '이메일이 형식에 맞지 않습니다'
              }})} />
        </Form.Group>
        {errors.email && <div className="error-message">{errors.email.message}</div>}
        <br />

        <Form.Group>
          <Form.Label>비밀번호</Form.Label>
          <Form.Control type="password" placeholder="비밀번호 입력" {...register("password", {required: "비밀번호를 입력해주세요."})}/>
        </Form.Group>
        {errors.password && <div className="error-message">{errors.password.message}</div>}
        <br />

        <Form.Group controlId="password">
          <Form.Label>비밀번호 확인</Form.Label>
          <Form.Control type="password" placeholder="비밀번호 확인" {
            ...register("password", {
              required: "비밀번호를 입력해주세요.", validate: (value) => 
                watch().password !== value ? '비밀번호가 일치하지 않습니다' : true,
              })}/>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mt-4">
          회원가입
        </Button>
      </Form>
    </Container>
  </div>
  );
}

export default Signup;