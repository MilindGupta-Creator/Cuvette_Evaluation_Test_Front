import React from "react";
import styles from "./Dashboard.module.css";
import TrendQuiz from "../../screens/TrendQuiz/TrendQuiz";

const Dashboard = ({ quizData, trendingQuizzes}) => {
  return (
    <div className={styles.dashboardScreen}>
      <div className={styles.dashboardMainCard}>
        <div className={styles.totalQuiz}>
          <div className={styles.dashboardQuizDataNumbers}>
            {quizData.quizzes}
          </div>
          Quizzes Created
        </div>
        <div className={styles.totalQuestions}>
          <div className={styles.dashboardQuizDataNumbers}>
            {quizData.questions}
          </div>
          Questions Created
        </div>
        <div className={styles.totalImpressions}>
          <div className={styles.dashboardQuizDataNumbers}>
            {quizData.impressions >= 1000
              ? `${(quizData.impressions / 1000).toFixed(1)}k`
              : quizData.impressions}
          </div>{" "}
          Impressions
        </div>
      </div>
      <div>
        <h2>Trending Quiz</h2>
        <div className={styles.trendingQuizCardContainer}>
          {trendingQuizzes.map((quiz) => (
            <TrendQuiz
              key={quiz._id}
              quizName={quiz.quizName}
              impressions={quiz.impressions}
              creationDate={new Date(quiz.date).toLocaleDateString(
                "en-US",
                { day: "2-digit", month: "short", year: "numeric" }
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
