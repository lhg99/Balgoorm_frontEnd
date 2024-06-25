import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './CommentSection.module.css';
import { useAuth } from '../user/auth/AuthContext';

const CommentSection = ({ postId, handleCommentUpdate, openCommentModal }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://k618de24a93cca.user-app.krampoline.com/api/board/${postId}/comments`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      console.error('댓글 내용을 입력해주세요.');
      return;
    }

    if (!user) {
      console.error('사용자가 로그인되지 않았습니다.');
      return;
    }

    const postData = {
      commentContent: newComment,
      nickname: user.nickname,
      userId: user.id,
    };

    try {
      await axios.post(`https://k618de24a93cca.user-app.krampoline.com/api/board/${postId}/comment`, postData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      fetchComments(); // 댓글 작성 후 최신 댓글 데이터를 다시 가져옵니다.
      setNewComment('');
      handleCommentUpdate(postId); // 댓글 작성 후 handleCommentUpdate 호출
    } catch (error) {
      console.error('댓글 등록 중 오류 발생:', error);
      if (error.response) {
        console.error(`서버 오류: ${error.response.status} - ${error.response.data.message}`);
      } else {
        console.error('서버와 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.');
      }
    }
  };

  const handleDeleteClick = (commentId) => {
    openCommentModal(commentId);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className={styles.commentSection}>
      <ul className={styles.commentList}>
        {comments.map(comment => (
          <li key={comment.commentId} className={styles.commentItem}>
            <div className={styles.commentHeader}>
              <span className={styles.commentAuthor}>{comment.nickname}</span>
              <span className={styles.commentContent}>{comment.commentContent}</span>
              {comment.userId === user?.id && (
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteClick(comment.commentId)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
        <div className={styles.inputContainer}>
          <div className={styles.userIcon}>
            <FontAwesomeIcon icon={faUser} />
          </div>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={styles.commentInput}
            placeholder="댓글 추가..."
          />
          <button type="submit" className={styles.submitButton}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
