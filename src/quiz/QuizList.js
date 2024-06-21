import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './QuizList.css';



function QuizList() {
  const [quiz, setQuiz] = useState([]);
  const [page, setPage] = useState(1);

  const fetchData = async (pageNumber) => {
    try {
      console.log("요청시작");
      const response = await axios.get(`http://localhost:8080/api/quiz/list/${pageNumber}`);
      console.log("요청완료 :" + JSON.stringify(response));
      setQuiz(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  return (
    <div className="quiz-page">
      <div className="quiz-title-container">
        <div>문제 목록</div>
      </div>

      <div className="quiz-container">
        <ul>
          {quiz.map((quizItem, index) => (
            <li key={index}>
              <Link to={`/quiz/detail/${quizItem.quizId}`}>
                {quizItem.quizTitle}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="list-container">
        <Button variant="primary" onClick={handlePreviousPage} disabled={page === 1}>
          이전
        </Button>
        <span>페이지 {page}</span>
        <Button variant="primary" onClick={handleNextPage}>
          다음
        </Button>
      </div>
    </div>
  );
}

export default QuizList;
