import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import homeworkService, { IHomework } from "../../servers/homeworkServer";
import questionService, { IQuestion } from "../../servers/questionServer";
import myHomeworkService, {
  IMyHomeworkModel,
} from "../../servers/myHomeworkServer";
import LoadingReact from "../../Components/LoadingReact";
import examService, { IExam } from "../../servers/examServer";
import myExamService, {
  IMyExam,
  IMyExamModel,
} from "../../servers/myExamServer";
interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}
interface CountdownTimerProps {
  startTime: Date;
  endTime: Date;
}
const calculateTimeLeft = (start: Date, end: Date): TimeLeft => {
  const totalSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
};
interface Prop {
  isExam: boolean;
}
const MyHomework: React.FC<Prop> = ({ isExam }) => {
  const { id } = useParams();
  const [homeWork, setHomeWork] = useState<Partial<IHomework>>({ _id: "" });
  const [question, setQuestion] = useState<Partial<IQuestion[]>>([]);
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [myHomeworkModel, setMyHomeworkModel] = useState<IMyHomeworkModel>({
    homeworkId: "",
    answers: [],
  });
  const [exam, setExam] = useState<Partial<IExam>>({ _id: "" });
  const [myExamModel, setMyExamModel] = useState<IMyExamModel>({
    examId: "",
    answers: [],
  });
  const [timeLeft, setTimeLeft] = useState<Partial<TimeLeft>>();
  const [loading, setLoading] = useState(true);
  const naviagate = useNavigate();
  const loadData = async () => {
    try {
      if (!isExam) {
        const response = await homeworkService.get(id as string);
        setHomeWork(response.data);
        const promise = response.data.questionId?.map((item) =>
          questionService.get(item)
        );
        const results = await Promise.all(promise);
        const array: IQuestion[] = results.map((res) => res.data);
        setMyHomeworkModel({
          homeworkId: id as string,
          answers: array.map((item) => ({
            questionId: item._id,
            answer: [],
          })),
        });
        setQuestion(array);
        setLoading(false);
      } else {
        const response = await examService.get(id as string);
        setExam(response.data);
        const promise = response.data.questionId?.map((item) =>
          questionService.get(item)
        );
        const results = await Promise.all(promise);
        const array: IQuestion[] = results.map((res) => res.data);
        setMyExamModel({
          examId: id as string,
          answers: array.map((item) => ({
            questionId: item._id,
            answer: [],
          })),
        });
        setQuestion(array);
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isExam) {
      if (
        (timeLeft?.hours as number) <= 0 &&
        (timeLeft?.minutes as number) <= 0 &&
        (timeLeft?.seconds as number) <= 0
      ) {
        handleSave();
        return;
      }

      const timerId = setTimeout(() => {
        const now = new Date();
        setTimeLeft(calculateTimeLeft(now, new Date(exam?.endDate as Date)));
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const hanldeChangeQuestion = (index: number) => {
    setIndexQuestion(index);
  };

  const handleChangeRadio = (
    indexQuestion: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isCheck = e.currentTarget.checked;
    if (isCheck) {
      if (!isExam) {
        let newAnswers = [...myHomeworkModel.answers];
        let answersIndex = newAnswers[indexQuestion];
        newAnswers[indexQuestion] = {
          ...answersIndex,
          answer: [e.currentTarget.value],
        };
        setMyHomeworkModel({
          ...myHomeworkModel,
          answers: newAnswers,
        });
      } else {
        let newAnswers = [...myExamModel.answers];
        let answersIndex = newAnswers[indexQuestion];
        newAnswers[indexQuestion] = {
          ...answersIndex,
          answer: [e.currentTarget.value],
        };
        setMyExamModel({
          ...myExamModel,
          answers: newAnswers,
        });
      }
    } else {
      if (!isExam) {
        const newQuestion = [...myHomeworkModel.answers];
        newQuestion[indexQuestion] = {
          ...newQuestion[indexQuestion],
          answer: [],
        };
        setMyHomeworkModel({
          ...myHomeworkModel,
          answers: newQuestion,
        });
      } else {
        const newQuestion = [...myExamModel.answers];
        newQuestion[indexQuestion] = {
          ...newQuestion[indexQuestion],
          answer: [],
        };
        setMyExamModel({
          ...myExamModel,
          answers: newQuestion,
        });
      }
    }
  };

  const handleChangeCheck = (
    indexQuestion: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isCheck = e.currentTarget.checked;
    if (isCheck) {
      let newAnswers = [
        ...(!isExam ? myHomeworkModel.answers : myExamModel.answers),
      ];

      let questionIndex = newAnswers[indexQuestion];
      const newAnswer: string[] = [...questionIndex.answer];
      newAnswer.push(e.currentTarget.value);
      newAnswers[indexQuestion] = {
        ...questionIndex,
        [e.currentTarget.name]: newAnswer,
      };
      if (!isExam) {
        setMyHomeworkModel({
          ...myHomeworkModel,
          answers: newAnswers,
        });
      } else {
        setMyExamModel({
          ...myExamModel,
          answers: newAnswers,
        });
      }
    } else {
      let newAnswers = [
        ...(!isExam ? myHomeworkModel.answers : myExamModel.answers),
      ];
      let questionIndex = newAnswers[indexQuestion];
      const newItem: string[] = questionIndex.answer.filter(
        (item) => item !== e.currentTarget.value
      );
      newAnswers[indexQuestion] = {
        ...questionIndex,
        answer: newItem,
      };
      if (!isExam) {
        setMyHomeworkModel({
          ...myHomeworkModel,
          answers: newAnswers,
        });
      } else {
        setMyExamModel({
          ...myExamModel,
          answers: newAnswers,
        });
      }
    }
  };
  const handleSave = async () => {
    try {
      if (!isExam) {
        await myHomeworkService.add(myHomeworkModel);
      } else {
        await myExamService.add(myExamModel);
      }
      handleNavigate();
    } catch (error: any) {
      console.log(error);
    }
  };
  const handleNavigate = () => {
    if (!isExam) {
      naviagate(`/dasboadHomework/${homeWork._id}`);
    } else {
      naviagate(`/dasboadExam/${exam._id}`);
    }
  };

  return (
    <>
      <div className="container mt-3">
        <div className="row mb-4">
          <div className="col-12 text-center fs-4 fw-bold text-success">
            {!isExam ? `${homeWork.name}` : exam.name}
          </div>
        </div>
      </div>
      {loading === false ? (
        <>
          <div className="container border rounded-3 mt-3">
            <div className="row">
              <div className="col-9 p-4">
                <div className="container">
                  <div className="row border rounded-3">
                    <div className="col-12 bg-success text-light fw-bold py-2 rounded-top-3 ">
                      <i className="fa-solid fa-question"></i> Câu hỏi số{" "}
                      {indexQuestion + 1} :
                    </div>
                    <div className="col-12 p-4">
                      <div className="row">
                        <div className="col-12 py-4 mb-3 rounded  border">
                          {question[indexQuestion]?.question ||
                            "Đang tải câu hỏi..."}
                        </div>
                        {question[indexQuestion]?.option.map((item, index) => (
                          <div className="input-group mb-2" key={index}>
                            <div className="input-group-text">
                              <input
                                className="form-check-input mt-0"
                                type={
                                  question[indexQuestion]?.isMul
                                    ? "checkbox"
                                    : "radio"
                                }
                                value={item}
                                checked={
                                  !isExam
                                    ? myHomeworkModel.answers[
                                        indexQuestion
                                      ].answer.includes(item)
                                    : myExamModel.answers[
                                        indexQuestion
                                      ].answer.includes(item)
                                }
                                aria-label="radio button for following text input"
                                onChange={
                                  (question[indexQuestion]?.answer
                                    ?.length as number) > 1
                                    ? (e) => handleChangeCheck(indexQuestion, e)
                                    : (e) => handleChangeRadio(indexQuestion, e)
                                }
                                name="answer"
                              />
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              aria-label="Text input with radio button"
                              value={item}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-3 p-4">
                <div className="row g-2">
                  {isExam && (
                    <div className="col-12 text-center p-3 text-bg-success fs-5 fw-bold">
                      {timeLeft?.hours?.toString().padStart(2, "0")} :{" "}
                      {timeLeft?.minutes?.toString().padStart(2, "0")} :{" "}
                      {timeLeft?.seconds?.toString().padStart(2, "0")}
                    </div>
                  )}
                  <div className="col-12 text-center mb-3">
                    <button
                      className="btn btn-success p-3"
                      onClick={handleSave}
                    >
                      {!isExam ? " Nộp bài tập về nhà" : "Nộp bài kiểm tra"}
                    </button>
                  </div>

                  <div className="col-12">
                    <div className="row g-3 ">
                      <div className="col-12 text-center">
                        Danh sách các câu hỏi
                      </div>
                      {question?.map((item, index) => (
                        <div className="col-3" key={index}>
                          <a
                            href="#"
                            className={`w-100 py-1 text-center d-inline-flex justify-content-center focus-ring focus-ring-primary   text-decoration-none border rounded-2 ${
                              index == indexQuestion
                                ? "text-bg-primary"
                                : !isExam
                                ? myHomeworkModel.answers[index].answer
                                    .length === 0
                                : myExamModel.answers[index].answer.length === 0
                                ? ""
                                : "text-bg-success"
                            }`}
                            onClick={() => hanldeChangeQuestion(index)}
                          >
                            {index + 1}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-12 mt-3">
                    <div className="row">
                      <div className="col-12 text-center">
                        <p>Chú thích</p>
                      </div>
                      <div className="col-12">
                        <p>
                          <span className="rounded-1 border px-3 me-1"></span>{" "}
                          Câu hỏi chưa trả lời
                        </p>
                      </div>
                      <div className="col-12">
                        <p>
                          <span className="rounded-1 border bg-primary px-3 me-1"></span>{" "}
                          Câu hỏi hiện tại
                        </p>
                      </div>
                      <div className="col-12">
                        <p>
                          <span className="rounded-1 border bg-success px-3 me-1 "></span>
                          Câu hỏi đã trả lời
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <LoadingReact />
      )}
    </>
  );
};

export default MyHomework;
