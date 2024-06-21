/**
 * 관리자 페이지
 * 오늘 가입자 수
 */

import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import UserEditModal from './UserEditModal.js';
import './Admin.css';
import { formatDate, useAuth } from '../auth/AuthContext.js';

function Admin() {
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { allUsers, setAllUsers, userCount, fetchAllUsers, fetchCount, isLoading } = useAuth();

  useEffect(() => {
    fetchAllUsers();
    fetchCount();
  }, [fetchAllUsers, fetchCount]);

  if(isLoading) {
    return <div>Loading...</div>;
  }
  
  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  }

  const handleSave = (updateUser) => {
    // 수정한 닉네임, 이메일 반영
    const updateUsers = allUsers.map(user => {
      if(user.id === updateUser.id) {
        return { 
          ...user, 
          nickname: updateUser.nickname, 
          email: updateUser.email, 
          createDate: formatDate(updateUser.createDate)
        };
      }
      return user;
    });
    setAllUsers(updateUsers);
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
              {allUsers.map((user, index) => (
                <tr key={user.id}>
                  <td className='column-user'>{index + 1}</td>
                  <td className='column-user'>{user.userId}</td>
                  <td className='column-user'>{user.nickname}</td>
                  <td className='column-user'>{user.email}</td>
                  <td className='column-user'>{user.createDate}</td>
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