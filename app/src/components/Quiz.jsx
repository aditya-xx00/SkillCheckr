import React, {useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';
// import { response } from 'express';


const Quiz = () => {

  const {category}=useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const[correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [lastProgress, setLastProgress] = useState(null);
  const [showLastProgress, setShowLastProgress] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const navigate=useNavigate();

 function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
} 
 
  useEffect(() => {
   const fetchQuestions = async () => {
    const res = await axios.get(`http://localhost:5000/questions/${category}`);
    const shuffled = shuffleArray(res.data);
    setQuestions(shuffled);
  };
     fetchQuestions();
  },[category]) 


  const handleAnswerOptionClick = (option) => {
     const updatedSelectedOptions = [...selectedOptions];
  updatedSelectedOptions[currentQuestion] = option;
  setSelectedOptions(updatedSelectedOptions);

  let newCorrect = correctAnswers;
  let newWrong = wrongAnswers;

  if (option === questions[currentQuestion].answer) {
    setScore(score + 1);
    setCorrectAnswers(correctAnswers + 1);
    newCorrect += 1;
  } else {
    setWrongAnswers(wrongAnswers + 1);
    newWrong += 1;
  }

  setTimeout(() => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResult(true);
      saveProgress(newCorrect, newWrong);
    }
  }, 400); 
};
  
  const restartQuiz=()=>{
      setCurrentQuestion(0)
      setScore(0)
      setShowResult(false)
      // setCorrectAnswer(0)
      // setWrongAnswer(0);
      navigate('/dashboard')
  }

  const saveProgress=async (correctAnswers,wrongAnswers)=>{
    const token=localStorage.getItem('token');
    await axios.post('http://localhost:5000/save-progress',{
      category,
      correctAnswers,
      wrongAnswers
    },{
       headers:{
           Authorization:`Bearer ${token}`
       }
    })
  }

   const handleShowMyScore = async () => {
  const token = localStorage.getItem('token');
  try {
    const res = await axios.get('http://localhost:5000/progress', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.data && res.data.length > 0) {
      setLastProgress(res.data[res.data.length - 1]);
      setShowLastProgress(true);
    }
  } catch (error) {
    console.error('Error fetching progress', error);
  }
  };
  return ( 
    <div className='quiz-container'>
       {showResult? (
       <div className='result-section'>
   <h1>Your Score: {score}</h1>
<button className='restart-button' onClick={restartQuiz}>Restart Quiz</button>
{!showLastProgress && (
  <button className='restart-button' onClick={handleShowMyScore} style={{ marginLeft: 10 }}>
    Analysis
  </button>
)}
{showLastProgress && lastProgress && (
  <div style={{ marginTop: 20, border: '1px solid #ccc', padding: 10, borderRadius: 6 }}>
    <h3>Last Progress</h3>
    <p><strong>Category:</strong> {lastProgress.category}</p>
    <p><strong>Correct Answers:</strong> {lastProgress.correctAnswers}</p>
    <p><strong>Wrong Answers:</strong> {lastProgress.wrongAnswers}</p>
    <p>
      <strong>Progress (%):</strong> {
        lastProgress.correctAnswers + lastProgress.wrongAnswers > 0
          ? ((lastProgress.correctAnswers / (lastProgress.correctAnswers + lastProgress.wrongAnswers)) * 100).toFixed(2) + '%'
          : '0%'
      }
    </p>
  </div>
)}
  </div>
       ):(
     <div className='question-section'>
        {questions.length>0 && (
           <>
      <h1 className='question-text'>{questions[currentQuestion].question}</h1>
         <div className='options-section'>
          {questions[currentQuestion].options.map((option,index)=>(
            //  <button key={index} className='option-button' onClick={()=>handleAnswerOptionClick(option)}>
            //      {option}
            //    </button>
            <button
  key={index}
  className={`option-button${selectedOptions[currentQuestion] === option ? ' selected' : ''}`}
  onClick={() => handleAnswerOptionClick(option)}
>
  {option}
</button>
             ))}  
           </div>
        </>
        
       )}
     </div>
      )}
    </div>
  )
}

export default Quiz
