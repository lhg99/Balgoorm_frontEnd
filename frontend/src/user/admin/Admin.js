/**
 * 관리자 페이지
 * 오늘 가입자 수
 * 확인되면 initialUsers 지우기
 */

import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import axios from 'axios';
import UserEditModal from './UserEditModal.js';
import './Admin.css';

function Admin() {
  const initialUsers = [
    { id: "lee99", nickname: "alice", email: "alice@example.com", create_date: "2024-06-14 10:00 AM"},
    { id: "lhg12", nickname: "Bob", email: "bob@example.com", create_date: "2024-06-10 02:00 PM" },
    { id: "lee29", nickname: "Charlie", email: "charlie@example.com", create_date: "2024-06-09 04:00 AM" }
  ]

  const [users, setUsers] = useState(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // 유저 데이터 가져옴
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/admin/all');
        setUsers(response.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // 총 회원수 가져옴
    const fetchCount = async () => {
      try {
        const response = await axios.get('http://localhost:8080/admin/totalUsers');
        setUserCount(response.data.count); // count: num 형태로 저장되있을 때
      } catch (error) {
        console.error('총 회원수 가져오기 실패', error);
      }
    }
    fetchCount();
  }, []);
  

  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  }

  const handleSave = (updateUser) => {
    // 수정한 닉네임, 이메일 반영
    const updateUsers = users.map(user => {
      if(user.id === updateUser.id) {
        return { 
          ...user, 
          nickname: updateUser.nickname, 
          email: updateUser.email, 
        };
      }
      return user;
    });
    setUsers(updateUsers);
    setShowModal(false);
  }
  
  return (
    <div>
      <div className='d-flex'>
        <div className='ms-5'>
          <h2 className='mt-5 fw-bold'>유저 관리</h2>
          <p>총 회원수: {userCount} 명</p>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th className='column'>아이디</th>
                <th className='column'>닉네임</th>
                <th className='column-email'>이메일</th>
                <th className='column-email'>생성시간</th>
                <th className='column'>편집</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td className='column-user'>{index + 1}</td>
                  <td className='column-user'>{user.id}</td>
                  <td className='column-user'>{user.nickname}</td>
                  <td className='column-user'>{user.email}</td>
                  <td className='column-user'>{user.create_date}</td>
                  <td>
                    <Button variant='secondary' onClick={() => handleEdit(user)}>편집</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {showModal && <UserEditModal isOpen={showModal} user={currentUser} onSave={handleSave} onRequestClose={() => setShowModal(false)} />}
        </div>
      </div>
    </div>
  )
}

export default Admin;