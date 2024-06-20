import React, { useCallback, useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

function UserEditModal({ isOpen, onRequestClose, user, onSave}) {
    const [nickname, setNickname] = useState(user.nickname);
    const [email, setEmail] = useState(user.email);

    useEffect(() => {
      setNickname(user.nickname);
      setEmail(user.email);
    }, [user]);
    

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/users/${user.id}`, {nickname, email});
            onSave({
                id: user.id,
                nickname: nickname,
                email: email,
                create_date: user.create_date
            });
            onRequestClose();
        } catch (error) {
            console.error('update 실패', error);
        }
    }, [nickname, email, user.id, user.create_date, onSave, onRequestClose]);

    return (
        <Modal show={isOpen} onHide={onRequestClose}>
            <Modal.Header>
                <Modal.Title>유저 편집</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formNickname">
                        <Form.Label>닉네임</Form.Label>
                        <Form.Control
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>이메일</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className='d-flex'>
                    <Button type='submit' variant="outline-primary">저장</Button>{' '}
                    <Button variant="outline-secondary" onClick={onRequestClose}>닫기</Button>{' '}
                </Modal.Footer>
            </Form>
        </Modal>
  )
}

export default UserEditModal;