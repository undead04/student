import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import questionService, { IQuestion } from "../../servers/questionServer";
import examService from "../../servers/examServer";

const ExamDetail = () => {
  let { id } = useParams();
  const [question, setQuestion] = useState<IQuestion[]>([]);
  const [indexQuestion, setIndexQuestion] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await examService.get(id).then((res) => res.data);

          if (response?.questionId && response?.questionId.length > 0) {
            const promises = response?.questionId.map((element) =>
              questionService.get(element)
            );
            const result = await Promise.all(promises);
            const array: IQuestion[] = result.map((res) => res.data);
            setQuestion(array);
          }
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchData();
  }, []); // Đưa `id` vào mảng phụ thuộc

  const handleIndex = (index: number) => {
    setIndexQuestion(index);
  };
  const listAnswer = ["A", "B", "C", "D", "E", "F"];
  return (
    <>
      <div className="container border rounded-3 mt-3">
        <div className="row">
          <div className="col-9 p-4 ">
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
                    {question[indexQuestion]?.option?.map((item, index) => (
                      <div className="col-12" key={index}>
                        {listAnswer[index]}. {item}
                      </div>
                    )) || <div>Đang tải các lựa chọn...</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="row">
              <div className="col-12 text-center mb-2 mt-3">
                Danh sách câu hỏi
              </div>
              <div className="col-12">
                <div className="row text-center">
                  {question.map((item, index) => (
                    <div
                      className={`col-3 `}
                      key={index}
                      onClick={() => handleIndex(index)}
                    >
                      <p>
                        <a
                          href="#"
                          className={`d-inline-flex focus-ring focus-ring-success py-1 px-3 text-decoration-none border rounded-2 ${
                            indexQuestion === index && "bg-success-subtle"
                          }`}
                        >
                          {index + 1}
                        </a>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExamDetail;
