import React from 'react';
import { useLocation } from "react-router-dom";
import styles from "./QuizCompletion.module.css"
import TrophyImage from "../../assets/images/trophy-image.png"

const QuizCompletion = () => {
  const location = useLocation();
  const { score, totalQuestions } = location.state;


  return (
    <div className={styles.mainContainer}>
        <div className={styles.thankYouContainer}>
          <div className={styles.headding}>Congrats Quiz is completed</div>
          <img src={TrophyImage} alt="" className={styles.trophyImage}/>
          <div className={styles.quizScore}>Your Score is <span className={styles.scoreColor}>  {score}/{totalQuestions}</span></div>
        </div>
      </div>
  )
}

export default QuizCompletion