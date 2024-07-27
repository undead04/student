import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import questionService, { IQuestion } from "../../servers/questionServer";
import myHomeworkService, { IMyHomework } from "../../servers/myHomeworkServer";
import LoadingReact from "../../Components/LoadingReact";
import myExamService, { IMyExam } from "../../servers/myExamServer";
interface Prop {
  isExam: boolean;
  isStatistical: boolean;
}
const MyHomeworkDetail: React.FC<Prop> = ({ isExam, isStatistical }) => {
  const { id } = useParams();
  const [myHomework, setMyHomework] = useState<Partial<IMyHomework>>({
    _id: "",
  });
  const [myExam, setMyExam] = useState<Partial<IMyExam>>({
    _id: "",
  });
  const [question, setQuestion] = useState<IQuestion[]>([]);
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const naviagate = useNavigate();
  const [totalScore, setTotalScore] = useState(0);
  const [connentQuestion, setConnentQuestion] = useState(0);
  const createAtDate = myExam.exam?.create_at
    ? new Date(myExam.exam.create_at).getTime()
    : 0;
  const answerDate = myExam.exam?.answerDate
    ? new Date(myExam.exam.answerDate).getTime()
    : 0;
  // Calculate the difference in milliseconds
  const timeDifference = createAtDate - answerDate;
  const loadData = async () => {
    try {
      if (!isExam) {
        const response = await myHomeworkService
          .get(id as string)
          .then((res) => res.data);
        const promise = response.answers?.map((item) => {
          return questionService.get(item.questionId);
        });
        const results = await Promise.all(promise);
        const array: IQuestion[] = results.map((res) => res.data);
        setQuestion(array);
        const total = array.reduce((current, item, index) => {
          if (
            item.answer.every((ans) =>
              response.answers[index].answer.includes(ans)
            )
          ) {
            return current + 1;
          }
          return current;
        }, 0);
        setTotalScore(() => (total / array.length) * 10);
        setConnentQuestion(total);
        setMyHomework(response);
        setLoading(false);
      } else {
        const response = await myExamService
          .get(id as string)
          .then((res) => res.data);
        const promise = response.answers?.map((item) => {
          return questionService.get(item.questionId);
        });
        const results = await Promise.all(promise);
        const array: IQuestion[] = results.map((res) => res.data);
        const total = array.reduce((current, item, index) => {
          if (
            item.answer.every((ans) =>
              response.answers[index].answer.includes(ans)
            )
          ) {
            return current + 1;
          }
          return current;
        }, 0);
        setTotalScore(() => (total / array.length) * 10);
        setConnentQuestion(total);
        setQuestion(array);
        setMyExam(response);
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  const handleChangeIndexQuestion = (
    e: React.FormEvent, // use FormEvent or a more specific event type
    index: number
  ) => {
    e.preventDefault();
    setIndexQuestion(index);
  };
  const handleCancel = () => {
    if (!isStatistical) {
      if (isExam) {
        naviagate(`/dasboadExam/${myExam.exam?._id}`);
      } else {
        naviagate(`/dasboadHomework/${myHomework.homework?._id}`);
        console.log(myHomework.homework?._id);
      }
    } else {
      if (!isExam) {
        naviagate(`/statisticalHomework/${myHomework.homework?._id}`);
      } else {
        naviagate(`/statisticalExam/${myExam.exam?._id}`);
      }
    }
  };
  return (
    <>
      <div className="container mt-3">
        <div className="row mb-4">
          <div className="col-12 text-center fs-4 fw-bold text-success">
            {!isExam ? myHomework.homework?.name : myExam.exam?.name}
          </div>
        </div>
      </div>
      <div className="container border border-2 rounded-5 mt-3">
        <div className="row">
          <div className="col-12 py-3 px-4">
            <p className="m-0">
              <strong>
                Họ và tên: {!isExam ? myHomework.user?.name : myExam.user?.name}
              </strong>
            </p>
            <p className="m-0">
              <strong>
                Học sinh lớp:{" "}
                {!isExam
                  ? myHomework.user?.classRoom?.name
                  : myExam.user?.classRoom?.name}
              </strong>
            </p>
          </div>
        </div>
      </div>
      <div className="container border border-2 rounded-5 mt-3">
        <div className="row py-3 px-3">
          <div className="col-6 col-lg-4">
            <p className="m-0">
              <strong>Điểm số: {totalScore}</strong>
            </p>
          </div>
          {isExam && myExam.exam && (
            <div className="col-6 col-lg-4">
              <p className="m-0">
                <strong>Thời gian làm bài: {timeDifference}</strong>
              </p>
            </div>
          )}
          <div className="col-6 col-lg-4">
            <p className="m-0">
              <strong>
                Số câu đúng: {connentQuestion}/{question.length}
              </strong>
            </p>
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
                          <div className="col-12">
                            <div className="row">
                              <div className="col-11">
                                <div className="input-group mb-2" key={index}>
                                  <div className="input-group-text">
                                    <input
                                      className="form-check-input mt-0"
                                      type={
                                        question[indexQuestion].isMul
                                          ? "checkbox"
                                          : "radio"
                                      }
                                      value={item}
                                      checked={
                                        !isExam
                                          ? myHomework.answers &&
                                            myHomework?.answers[
                                              indexQuestion
                                            ]?.answer.includes(item)
                                          : myExam.answers &&
                                            myExam?.answers[
                                              indexQuestion
                                            ]?.answer.includes(item)
                                      }
                                      aria-label="radio button for following text input"
                                      name="answer"
                                      disabled
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    className="form-control"
                                    aria-label="Text input with radio button"
                                    value={item}
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="col-1">
                                {!isExam
                                  ? myHomework.answers &&
                                    myHomework.answers[
                                      indexQuestion
                                    ]?.answer.map((answer, index) =>
                                      item === answer ? (
                                        question[
                                          indexQuestion
                                        ]?.answer.includes(answer) ? (
                                          <i
                                            key={index}
                                            className="fa-solid fa-check text-success"
                                          ></i>
                                        ) : (
                                          <i className="fa-solid fa-x text-danger "></i>
                                        )
                                      ) : null
                                    )
                                  : myExam.exam &&
                                    new Date() >=
                                      new Date(myExam.exam.answerDate) &&
                                    myExam.answers &&
                                    myExam.answers[indexQuestion]?.answer.map(
                                      (answer, index) =>
                                        item === answer ? (
                                          question[
                                            indexQuestion
                                          ]?.answer.includes(answer) ? (
                                            <i
                                              key={index}
                                              className="fa-solid fa-check text-success"
                                            ></i>
                                          ) : (
                                            <i className="fa-solid fa-x text-danger "></i>
                                          )
                                        ) : null
                                    )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {!isExam ? (
                          <div className="col-12">
                            {question[indexQuestion].answer.every((questions) =>
                              myHomework.answers?.[
                                indexQuestion
                              ]?.answer.includes(questions)
                            ) ? (
                              <div className="alert alert-success" role="alert">
                                <p>Câu trả lời của bạn đúng</p>
                                <p>
                                  Đáp án:{" "}
                                  {question[indexQuestion].answer.join(", ")}
                                </p>
                              </div>
                            ) : (
                              <div className="alert alert-danger" role="alert">
                                <p>Câu trả lời của bạn sai</p>
                                <p>
                                  Đáp án:{" "}
                                  {question[indexQuestion].answer.join(", ")}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          myExam.exam &&
                          new Date() >= new Date(myExam.exam?.answerDate) && (
                            <div className="col-12">
                              {question[indexQuestion].answer.every(
                                (questions) =>
                                  myExam.answers?.[
                                    indexQuestion
                                  ]?.answer.includes(questions)
                              ) ? (
                                <div
                                  className="alert alert-success"
                                  role="alert"
                                >
                                  <p>Câu trả lời của bạn đúng</p>
                                  <p>
                                    Đáp án:{" "}
                                    {question[indexQuestion].answer.join(", ")}
                                  </p>
                                </div>
                              ) : (
                                <div
                                  className="alert alert-danger"
                                  role="alert"
                                >
                                  <p>Câu trả lời của bạn sai</p>
                                  <p>
                                    Đáp án:{" "}
                                    {question[indexQuestion].answer.join(", ")}
                                  </p>
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-3 p-4">
                <div className="row g-2">
                  <div className="col-12">
                    <div className="row g-3">
                      <div className="col-12 text-center mb-3">
                        Danh sách các câu hỏi
                      </div>
                      {question?.map((item, index) => (
                        <div className="col-3" key={index}>
                          <a
                            href="#"
                            className={`w-100 d-inline-flex justify-content-center focus-ring focus-ring-primary py-1 text-decoration-none border rounded-2 ${
                              index == indexQuestion && "text-bg-primary"
                            }`}
                            onClick={(e) => handleChangeIndexQuestion(e, index)}
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
                  <div className="col-12 text-center">
                    <button
                      className="btn btn-secondary px-3"
                      onClick={handleCancel}
                    >
                      Thoát
                    </button>
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

export default MyHomeworkDetail;
