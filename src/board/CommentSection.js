import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './CommentSection.module.css';
import { useAuth } from '../user/auth/AuthContext';

const CommentSection = ({ postId, userId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://k618de24a93cca.user-app.krampoline.com/api/comments?postId=${postId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentData = {
      boardId: postId,
      userId,
      commentContent: newComment,
      likesCount: 0,
    };

    try {
      const response = await axios.post('https://k618de24a93cca.user-app.krampoline.com/api/comments', newCommentData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const confirmDeleteComment = async () => {
    if (commentToDelete !== null) {
      try {
        await axios.delete(`https://k618de24a93cca.user-app.krampoline.com/api/board/1/comment${commentToDelete}`, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        });

        setComments(comments.filter(comment => comment.commentId !== commentToDelete));
        setCommentToDelete(null);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };


  const openModal = (commentId) => {
    setCommentToDelete(commentId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCommentToDelete(null);
    setIsModalOpen(false);
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
              {comment.userId === userId && (
                <button
                  className={styles.deleteButton}
                  onClick={() => openModal(comment.commentId)}
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
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>댓글을 삭제하시겠습니까?</p>
            <div className={styles.modalButtons}>
              <button onClick={confirmDeleteComment} className={styles.confirmButton}>삭제</button>
              <button onClick={closeModal} className={styles.cancelButton}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
