import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import styles from "./AdminPanel.module.css";
import DeleteIcon from "../../assets/images/delete-icon.svg";
import EditIcon from "../../assets/images/edit-icon.svg";
import ShareIcon from "../../assets/images/share-icon.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteQuizModal from "../DeleteQuizModal/DeleteQuizModal";
import Dashboard from "../../Component/DashboardScreen/Dashboard";
import Report from "../Report/Report";

const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const [activeScreen, setActiveScreen] = useState("dashboard");

  const [showModal, setShowModal] = useState(false);
  const handleDeleteIconClick = (quizId) => {
    setQuizIdToDelete(quizId);
    // Show the confirmation modal
    setShowModal(true);
  };
  const [quizIdToDelete, setQuizIdToDelete] = useState(null);

  const handleDelete = () => {
    // Delete the quiz
    axios
      .delete(`https://mernback-u0bj.onrender.com/api/quiz/${quizIdToDelete}`)
      .then((response) => {
        setQuizzes(quizzes.filter((quiz) => quiz._id !== quizIdToDelete));
        setShowModal(false);
      })
      .catch((error) => toast.error("Error deleting quiz: " + error));
  };

  const handleCancel = () => {
    setShowModal(false);
    setShowQuizPublishedModal(false);
  };

  const [email, setEmail] = useState("");
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("");
  const handleCancelQuizModal = () => {
    setActiveScreen("dashboard");
  };

  const showQuizzes = () => {
    if (!quizName || !quizType) return alert("Please fill in the Quiz Name and Quiz Type");
    
    setShowQuestionModal(true);
    setActiveScreen("dashboard");
  };
  

  const handleCancelQuizQuestionModal = () => {
    setShowQuestionModal(false);
  };

  const [questions, setQuestions] = useState([1]);
  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setQuestions([...questions, { title: "" }]);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleDeleteQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);

      if (currentQuestionIndex === index) {
        setCurrentQuestionIndex(index > 0 ? index - 1 : 0);
      } else if (currentQuestionIndex > index) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    }
    // setCurrentQuestionIndex(index-1)
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    // Perform side effects here when currentQuestionIndex changes
  }, [currentQuestionIndex]);

  // Update question number change handler to set current question index
  const handleQuestionNoChange = (index) => {
    setCurrentQuestionIndex(index);
  };

  // useEffect(() => {
  //   console.log(currentQuestionIndex + 1);
  // }, [currentQuestionIndex]);

  //for questions and options
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  const handleOptionTypeSelect = (index) => {
    setSelectedOptionType(index);
  };

  const [pollQuestion, setPollQuestion] = useState({});
  const handleQuestionTextChange = (e, index) => {
    const updatedQuestions = { ...pollQuestion };
    updatedQuestions[index] = e.target.value;
    setPollQuestion(updatedQuestions);
  };

  const [options, setOptions] = useState(
    Array(5)
      .fill()
      .map(() => [
        { text: "", imageURL: "" },
        { text: "", imageURL: "" },
        { text: "", imageURL: "" },
        { text: "", imageURL: "" },
      ])
  );

  const [selectedOptionType, setSelectedOptionType] = useState(0);
  const [ansOption, setAnsOption] = useState({});
  const handleRadioSelect = (index) => {
    const updatedAnsOptions = { ...ansOption };
    updatedAnsOptions[currentQuestionIndex] = index;
    setAnsOption(updatedAnsOptions);
  };

  const [timerType, setTimerType] = useState({});

  const [newQuizId, setNewQuizId] = useState(null);

  const handleTimerTypeSelect = (value) => {
    const updatedTimerTypes = { ...timerType };
    updatedTimerTypes[currentQuestionIndex] = value;
    setTimerType(updatedTimerTypes);
  };

  const handleCreateQuizSubmit = () => {
    const isPollQuestionFilled = pollQuestion[0] !== "";
    const isOptionsFilled = options.some((option) =>
      option.some((item) => item.text !== "" || item.imageURL !== "")
    );
    const isAnsOptionFilled = Object.values(ansOption).some(
      (value) => value !== null
    );
    const isTimerTypeFilled =
      quizType !== "Poll Type"
        ? Object.values(timerType).some((value) => value !== "")
        : true;
    if (!isPollQuestionFilled) {
      toast.error("Poll question is not filled");
    }
    if (selectedOptionType === null) {
      toast.error("Selected option type is not set");
    }
    if (!isOptionsFilled) {
      toast.error("Options are not filled");
    }
    if (!isAnsOptionFilled) {
      toast.error("Answer option is not filled");
    }
    if (!isTimerTypeFilled) {
      toast.error("Timer type is not filled");
    }

    if (!quizName || !quizType) {
      toast.error("Please fill in the Quiz Name and Quiz Type");
      return;
    }

    if (
      !isPollQuestionFilled ||
      selectedOptionType === null ||
      !isOptionsFilled ||
      !isAnsOptionFilled ||
      (quizType !== "Poll Type" && !isTimerTypeFilled)
    ) {
      toast.error("Please fill all the fields before creating the quiz.");
    } else {
      console.log(options);

      const questions = [
        {
          pollQuestion,
          timerType,
          options,
          ansOption,
        },
        // More question objects here...
      ];

      axios
        .post(
          "https://mernback-u0bj.onrender.com/api/createquiz",
          { quizName, quizType, questions, email },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setNewQuizId(response.data.id);
          toast.success("Quiz created successfully!");
        })
        .catch((error) => {
          toast.error("An error occurred while saving the quiz: " + error);
        });

      // delete data in states
      setPollQuestion("");
      setOptions(
        Array(5)
          .fill()
          .map(() => [
            { text: "", imageURL: "" },
            { text: "", imageURL: "" },
            { text: "", imageURL: "" },
            { text: "", imageURL: "" },
          ])
      );
      setAnsOption({});
      setTimerType({});
      setQuizName("");
      setQuizType("");
      setQuestions([1]);
      setCurrentQuestionIndex(0);
      setShowQuizPublishedModal(true);
      setShowQuestionModal(false);
      setNewQuizId(null);
    }
  };

  const handleOptionTextChange = (e, questionIndex, optionIndex) => {
    const updatedOptions = [...options];
    updatedOptions[questionIndex][optionIndex] = {
      ...updatedOptions[questionIndex][optionIndex],
      text: e.target.value,
    };
    setOptions(updatedOptions);
  };

  const handleOptionImageURLChange = (e, questionIndex, optionIndex) => {
    const updatedOptions = [...options];
    updatedOptions[questionIndex][optionIndex] = {
      ...updatedOptions[questionIndex][optionIndex],
      imageURL: e.target.value,
    };
    setOptions(updatedOptions);
  };
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    axios
      .get(`https://mernback-u0bj.onrender.com/api/quizzes?email=${email}`)
      .then((response) => {
        setQuizzes(response.data);
      })
      .catch((error) => {
        console.error("An error occurred while fetching the quizzes:", error);
      });
  }, [activeScreen, email]);

  //for quiz published modal
  const [showQuizPublishedModal, setShowQuizPublishedModal] = useState(false);

  //getting the login credentials from the user
  const jwtToken = Cookies.get("jwt");
  axios
    .get("https://mernback-u0bj.onrender.com/api/isloggedin", {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })

    .then((response) => {
      if (response.data.isLoggedIn) {
        setEmail(response.data.user.email);
        setIsLoggedIn(response.data.isLoggedIn);
        // toast.success("User is logged in");
      } else {
        toast.error("User is not logged in");
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });

  const handleLogout = () => {
    axios
      .post("https://mernback-u0bj.onrender.com/api/logout", null, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          Cookies.remove("jwt");
          // setIsLoggedIn(false);
          // console.log("User is logged out");
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  const handleShareIconClick = (quizId) => {
    const quizLink = `https://mernback-u0bj.onrender.com/quiz/${quizId}`;
    navigator.clipboard
      .writeText(quizLink)
      .then(() => {
        // alert("Quiz link copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying quiz link to clipboard:", error);
      });

    toast.success("Link copied to Clipboard", {
      position: "top-right",
      autoClose: 1400,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const notifyLinkCopied = () => {
    if (newQuizId) {
      const quizLink = `https://mernback-u0bj.onrender.com/quiz/${newQuizId}`;
      navigator.clipboard
        .writeText(quizLink)
        .then(() => {
          // The copy operation was successful
        })
        .catch((err) => {
          // The copy operation failed
          console.error("Failed to copy quiz link: ", err);
        });
    }
    toast.success("Link copied to Clipboard", {
      position: "top-right",
      autoClose: 1400,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const [quizData, setQuizData] = useState({
    quizzes: 0,
    questions: 0,
    impressions: 0,
  });
  const [trendingQuizzes, setTrendingQuizzes] = useState([]);
  useEffect(() => {
    // Replace with your actual API endpoint
    axios
      .get(`https://mernback-u0bj.onrender.com/api/userData?email=${email}`)
      .then((response) => {
        const { quizzes, questions, impressions } = response.data;
        setQuizData({ quizzes, questions, impressions });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

    axios
      .get(`https://mernback-u0bj.onrender.com/api/trendingQuizzes?email=${email}`)
      .then((response) => {
        setTrendingQuizzes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching trending quizzes:", error);
      });
  }, [email]);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.sideBar}>
          <div className={styles.logo}>QUIZZIE</div>
          <div className={styles.modesContainer}>
            <button
              className={`${styles.modeBtn} ${
                activeScreen === "dashboard" ? styles.activeScreen : ""
              }`}
              onClick={() => setActiveScreen("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`${styles.modeBtn} ${
                activeScreen === "analytics" ? styles.activeScreen : ""
              }`}
              onClick={() => setActiveScreen("analytics")}
            >
              Analytics
            </button>
            <button
              className={`${styles.modeBtn} ${
                activeScreen === "createQuiz" ? styles.activeScreen : ""
              }`}
              onClick={() => setActiveScreen("createQuiz")}
            >
              Create Quiz
            </button>
          </div>
          <hr />
          <button
            className={styles.logoutBtn}
            onClick={isLoggedIn ? handleLogout : () => navigate("/")}
          >
            {isLoggedIn ? "LOGOUT" : "LOG IN"}
          </button>
        </div>
        <div className={styles.subContainer}>
          {activeScreen === "dashboard" && 
              <Dashboard quizData={quizData}
              trendingQuizzes={trendingQuizzes}/>
          }
          {activeScreen === "analytics" && (
            <div className={styles.analyticsScreen}>
              <h1 className={styles.analyticsHeading}>Quiz Analytics</h1>
              <table className={styles.analyticsTable}>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Quiz Name</th>
                    <th>Created on</th>
                    <th>Impression</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz, index) => (
                    <tr key={quiz._id}>
                      <td>{index + 1}</td>
                      <td>{quiz.quizName}</td>
                      <td>{new Date(quiz.date).toLocaleDateString()}</td>
                      <td>{quiz.impressions}</td>
                      <td>
                        <img src={EditIcon} alt="" />
                        <img
                          src={DeleteIcon}
                          alt=""
                          onClick={() => handleDeleteIconClick(quiz._id)}
                        />
                        <img
                          src={ShareIcon}
                          alt=""
                          onClick={() => handleShareIconClick(quiz._id)}
                        />
                      </td>
                      <td><Report quizzes={quizzes}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table></table>
            </div>
          )}
        </div>
        {showModal && (
          <DeleteQuizModal
            handleDelete={handleDelete}
            handleCancel={handleCancel}
          />
        )}
        {activeScreen === "createQuiz" && (
          <div className={styles.createQuizScreen}>
            <div className={styles.modalOverlay}>
              <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.modalQuizNameContent}>
                  <div>
                    <input
                      type="text"
                      placeholder="Quiz name"
                      value={quizName}
                      onChange={(e) => setQuizName(e.target.value)}
                      className={styles.modalQuizNameInput}
                    />
                  </div>
                  <div className={styles.modalQuizTypeContainer}>
                    <div className={styles.quiztypes}>Quiz Type</div>
                    <label className={styles.questype}>
                      <input
                        type="radio"
                        value="Q & A"
                        checked={quizType === "Q & A"}
                        onChange={() => setQuizType("Q & A")}
                        className={styles.modalRadio}
                      />
                      Q & A
                    </label>
                    <label className={styles.questype}>
                      <input
                        type="radio"
                        value="Poll Type"
                        checked={quizType === "Poll Type"}
                        onChange={() => setQuizType("Poll Type")}
                        className={styles.modalRadio}
                      />
                      Poll Type
                    </label>
                  </div>
                  <div className={styles.buttonContainer}>
                    <button
                      onClick={handleCancelQuizModal}
                      className={styles.cancelModalButton}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={showQuizzes}
                      className={styles.confirmQuizNameButton}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showQuestionModal && (
          <div
            className={styles.questionModalOverlay}
            // onClick={handleCreateQuiz}
          >
            <div
              className={styles.questionModal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalContent}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  className={styles.questionNoContainer}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: ".5rem",
                      alignItems: "center",
                    }}
                  >
                    {questions.map((question, index) => (
                      <div
                        className={`${styles.questionNo} ${
                          index === currentQuestionIndex
                            ? styles.activeQuestionNumber
                            : ""
                        }`}
                        key={index}
                        onClick={() => handleQuestionNoChange(index)}
                      >
                        {index + 1}
                        {index !== 0 && (
                          <span
                            className={styles.crossBtn}
                            onClick={() => handleDeleteQuestion(index)}
                          >
                            x
                          </span>
                        )}
                      </div>
                    ))}
                    {questions.length < 5 && (
                      <div
                        className={styles.addBtn}
                        onClick={handleAddQuestion}
                      >
                        +
                      </div>
                    )}
                  </div>
                  <p>Max 5 Questions</p>
                </div>
                <div className={styles.questionContent}>
                  <div>
                    <input
                      type="text"
                      placeholder="Poll Question"
                      value={pollQuestion[currentQuestionIndex] || ""}
                      onChange={(e) =>
                        handleQuestionTextChange(e, currentQuestionIndex)
                      }
                      className={styles.pollQuestion}
                    />
                  </div>

                  <div
                    className={styles.pollOptionType}
                    style={{ display: "flex" }}
                  >
                    <div>Option Type</div>
                    <label className={styles.modalLabel}>
                      <input
                        type="radio"
                        name="optionType"
                        checked={selectedOptionType === 0}
                        onChange={() => handleOptionTypeSelect(0)}
                      />
                      Text
                    </label>
                    <label className={styles.modalLabel}>
                      <input
                        type="radio"
                        name="optionType"
                        checked={selectedOptionType === 1}
                        onChange={() => handleOptionTypeSelect(1)}
                      />
                      Image URL
                    </label>
                    <label className={styles.modalLabel}>
                      <input
                        type="radio"
                        name="optionType"
                        checked={selectedOptionType === 2}
                        onChange={() => handleOptionTypeSelect(2)}
                      />
                      Text and Image URL
                    </label>
                  </div>
                  <div
                    className={styles.pollOptions}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    {[0, 1, 2, 3].map((index) => (
                      <div className={styles.modalLabel} key={index}>
                        <input
                          type="radio"
                          name="ansOption"
                          checked={ansOption[currentQuestionIndex] === index}
                          onChange={() => handleRadioSelect(index)}
                        />
                        {selectedOptionType === 0 && (
                          <input
                            type="text"
                            name={`optionText_${index}`}
                            value={options[currentQuestionIndex][index].text}
                            placeholder="Option"
                            onChange={(e) =>
                              handleOptionTextChange(
                                e,
                                currentQuestionIndex,
                                index
                              )
                            }
                            className={`${styles.optionInput} ${
                              ansOption &&
                              ansOption[currentQuestionIndex] === index
                                ? styles.greenBackground
                                : ""
                            }`}
                          />
                        )}
                        {selectedOptionType === 1 && (
                          <input
                            type="url"
                            name={`optionImageURL_${index}`}
                            value={
                              options[currentQuestionIndex][index].imageURL
                            }
                            placeholder="Option Image URL"
                            onChange={(e) =>
                              handleOptionImageURLChange(
                                e,
                                currentQuestionIndex,
                                index
                              )
                            }
                            className={`${styles.optionInput} ${
                              ansOption &&
                              ansOption[currentQuestionIndex] === index
                                ? styles.greenBackground
                                : ""
                            }`}
                          />
                        )}
                        {selectedOptionType === 2 && (
                          <>
                            <input
                              type="text"
                              name={`optionText_${index}`}
                              value={options[currentQuestionIndex][index].text}
                              placeholder="Option"
                              onChange={(e) =>
                                handleOptionTextChange(
                                  e,
                                  currentQuestionIndex,
                                  index
                                )
                              }
                              className={`${styles.optionInput} ${
                                ansOption &&
                                ansOption[currentQuestionIndex] === index
                                  ? styles.greenBackground
                                  : ""
                              }`}
                            />

                            <input
                              type="url"
                              name={`optionImageURL_${index}`}
                              value={
                                options[currentQuestionIndex][index].imageURL
                              }
                              placeholder="Option Image URL"
                              onChange={(e) =>
                                handleOptionImageURLChange(
                                  e,
                                  currentQuestionIndex,
                                  index
                                )
                              }
                              className={`${styles.optionInput} ${
                                ansOption &&
                                ansOption[currentQuestionIndex] === index
                                  ? styles.greenBackground
                                  : ""
                              }`}
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {quizType !== "Poll Type" && (
                    <div className={styles.timerType}>
                      <div>Timer Type</div>
                      <label className={styles.modalLabel}>
                        <input
                          type="radio"
                          name="timerType"
                          value="5 Sec"
                          checked={timerType[currentQuestionIndex] === "5 Sec"}
                          onChange={() => handleTimerTypeSelect("5 Sec")}
                        />{" "}
                        5 Sec
                      </label>
                      <label className={styles.modalLabel}>
                        <input
                          type="radio"
                          name="timerType"
                          value="10 Sec"
                          checked={timerType[currentQuestionIndex] === "10 Sec"}
                          onChange={() => handleTimerTypeSelect("10 Sec")}
                        />
                        10 Sec
                      </label>
                      <label className={styles.modalLabel}>
                        <input
                          type="radio"
                          name="timerType"
                          value="OFF"
                          checked={timerType[currentQuestionIndex] === "OFF"}
                          onChange={() => handleTimerTypeSelect("OFF")}
                        />{" "}
                        OFF
                      </label>
                    </div>
                  )}
                  <div className={styles.buttonContainer}>
                    <button
                      onClick={handleCancelQuizQuestionModal}
                      className={styles.cancelModalButton}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateQuizSubmit}
                      className={styles.confirmCreateQuizButton}
                    >
                      Create Quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showQuizPublishedModal && (
          <div className={styles.modalOverlay} onClick={handleCancel}>
            <div
              className={styles.modalPublished}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalContent}>
                <p
                  style={{
                    fontSize: "1.7rem",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Congrats your Quiz is <br />
                  Published!
                </p>
                <div className={styles.quizLink}>
                  {newQuizId
                    ? `https://mernback-u0bj.onrender.com/quiz/${newQuizId}`
                    : "Link not created, Please create a new Quiz"}
                </div>

                <div className={styles.buttonContainer}>
                  <button
                    // onClick={handleConfirm}
                    className={styles.shareLinkBtn}
                    onClick={notifyLinkCopied}
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminPanel;
