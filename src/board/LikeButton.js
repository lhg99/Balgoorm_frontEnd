import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as solidThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as regularThumbsUp } from '@fortawesome/free-regular-svg-icons';
import styles from './LikeButton.module.css'; // module.css 파일을 import

const LikeButton = ({ postId, isLikedInitially, likesCountInitially, onLikeToggle }) => {
    const [isLiked, setIsLiked] = useState(isLikedInitially);
    const [likesCount, setLikesCount] = useState(likesCountInitially);

    useEffect(() => {
        setIsLiked(isLikedInitially);
        setLikesCount(likesCountInitially);
    }, [isLikedInitially, likesCountInitially]);

    const handleLikeClick = async (event) => {
        event.stopPropagation(); // 이벤트 전파를 막음
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(prevCount => prevCount + (newIsLiked ? 1 : -1));

        try {
            await axios.post(`http://localhost:8080/api/posts/${postId}/like`, { isLiked: newIsLiked });
            onLikeToggle(postId, newIsLiked);
        } catch (error) {
            console.error('Error toggling like:', error);
            setIsLiked(isLiked); // 에러가 발생하면 원래 상태로 롤백
            setLikesCount(prevCount => prevCount - (newIsLiked ? 1 : -1));
        }
    };

    return (
        <div className={styles.likeButtonContainer} onClick={handleLikeClick}>
            <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={isLiked ? solidThumbsUp : regularThumbsUp} className={styles.icon} />
                <span className={styles.count}>{likesCount}</span>
            </div>
        </div>
    );
};

export default LikeButton;
