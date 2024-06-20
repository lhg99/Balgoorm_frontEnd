import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ListGroup, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function QuizList() {
  const [quiz, setquiz] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("요청시작")
        const response = await axios.get('http://localhost:8080/quiz/list/1');
        console.log("요청완료")
        setquiz(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div>
        문제 목록
      </div>
      <ListGroup>
        {quiz.map((quiz, index) => (
          <ListGroup.Item key={index}>
            <Link to={`/quiz/detail/${quiz.quizId}`}>{quiz.quizTitle}</Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default QuizList;