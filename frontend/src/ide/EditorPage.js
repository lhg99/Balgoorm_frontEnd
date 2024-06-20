import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Button, Tabs, Tab } from 'react-bootstrap';
import Modal from '../components/modal/Modal';
import axios from 'axios';
import './EditorPage.css';

function EditorPage() {
  const { id } = useParams(); // 퀴즈 ID에 해당
  const editorRef = useRef(null);
  const [output, setOutput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [quiz, setQuiz] = useState({ quiz_title: '', quiz_content: '', quiz_reg_date: '' });

  useEffect(() => {
    // axios.get(`http://localhost:8080/quiz/detail/${id}?userId=${userId}`)
    axios.get(`http://localhost:8080/quiz/detail/${id}?userId=1`)
      .then(response => {
        const data = response.data;
        console.log('Fetched problem data:', data);
        setQuiz(data);
      })
      .catch(error => {
        console.error('Error fetching problem data:', error);
      });
  }, [id]);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function runCode() {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      try {
        // eslint-disable-next-line no-eval
        const result = eval(code);
        setOutput(result);
        checkAnswer(result);
      } catch (error) {
        setOutput(error.toString());
        setModalMessage('오답');
        setIsModalOpen(true);
      }
    }
  }

  function checkAnswer(userOutput) {
    axios.post('http://localhost:8080/api/problems/check', {
      problemId: id,
      userOutput: userOutput
    })
      .then(response => {
        const isCorrect = response.data;
        setModalMessage(isCorrect ? '정답' : '오답');
        setIsModalOpen(true);
      })
      .catch(error => {
        console.error('Error checking answer:', error);
        setModalMessage('오답');
        setIsModalOpen(true);
      });
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <div className="editor-page">
      <div className="problem-container">
        <Tabs defaultActiveKey="basic" id="problem-tabs">
          <Tab eventKey="basic" title="기본 개념" className="tab-content">
            <div className="basic-content">
              기본 개념 내용
            </div>
          </Tab>
          <Tab eventKey="problem" title="문제" className="tab-content">
            <div className="problem-name">
              {quiz.quizTitle}
            </div>
            <div className="problem-content">
              {quiz.quizContent ? quiz.quizContent.split('\\n').map((line, index) => (
                <div key={index}>{line}</div>
              )) : 'Loading...'}
            </div>
            <div className="problem-detail">
              <div className="problem-detail-name">
                주의사항? 입출력예제?
              </div>
              {quiz.quizRegDate ? quiz.quizRegDate.split('\\n').map((line, index) => (
                <div key={index}>{line}</div>
              )) : 'Loading...'}
            </div>
          </Tab>
          <Tab eventKey="qnaboard" title="질의응답">
            <div className="placeholder-content">
              {/* 여기에 나중에 내용을 추가할 수 있습니다 */}
            </div>
          </Tab>
        </Tabs>
      </div>

      <div className="editor-container">
        <div className="editor-box">
          <Editor
            width="100%"
            height="100%"
            language="javascript"
            theme="vs-dark"
            defaultValue={`// 기본 사용법 작성
//~~~~~~~~
// 예제: 두 숫자의 합을 계산하여 반환하는 함수
function add(a, b) {
  return a + b;
}

add(5, 10);`}
            onMount={handleEditorDidMount}
            options={{
              padding: {
                top: 10
              }
            }}
          />
        </div>
        <div className="run-btn">
          <Button variant="outline-dark" onClick={runCode}>답안제출</Button>
        </div>
        <div className="output-container">
          <div className="output-title">Output:</div>
          <pre>{output}</pre>
        </div>
        {isModalOpen && <Modal message={modalMessage} onClose={closeModal} />}
      </div>
    </div>
  );
}

export default EditorPage;
