import * as React from "react";
import { useState, useEffect } from "react";
import QuestionAdd from "../question/QuestionAdd";
import questionService, { IQuestion } from "../../servers/questionServer";
interface Prop {
  question: IQuestion[];
  level: number;
  handleLevel: any;
  handleAddQuesion: any;
  handleRemoveQuestion: any;
  selectedQuestion: string[];
  checkDifferentQuestion: boolean;
  setCheckDifferentQuestion: React.Dispatch<React.SetStateAction<boolean>>;
}
const HomewordQuestion: React.FC<Prop> = ({
  question,
  level,
  handleLevel,
  handleAddQuesion,
  selectedQuestion,
  handleRemoveQuestion,
  checkDifferentQuestion,
  setCheckDifferentQuestion,
}) => {
  const [listQuestion, setListQuestion] = useState<IQuestion[]>([]);
  useEffect(() => {
    if (selectedQuestion?.length > 0) {
      const fetchQuestions = async () => {
        const promises = selectedQuestion.map((element) =>
          questionService.get(element)
        );
        const results = await Promise.all(promises);
        const array: IQuestion[] = results.map((res) => res.data);
        setListQuestion(array);
      };
      fetchQuestions();
    } else {
      setListQuestion([]); // Đặt lại listQuestion nếu defaultQuestion là mảng rỗng
    }
  }, [selectedQuestion]);
  const listLevel = ["Thấp", "Trung bình", "Cao"];
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="row">
              <div className="col-12">
                <nav className="nav  flex-column flex-sm-row nav-underline">
                  {listLevel.map((item, index) => (
                    <a
                      key={index}
                      className={`flex-sm-fill text-sm-center nav-link ${
                        level === index && "active"
                      }`}
                      aria-current="page"
                      onClick={() => handleLevel(index)}
                    >
                      {item}
                    </a>
                  ))}
                </nav>
              </div>
              <div className="col-12 mt-4">
                <div className="form-check ">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="checkDifferentQuestion"
                    checked={checkDifferentQuestion}
                    onChange={(e) =>
                      setCheckDifferentQuestion(e.currentTarget.checked)
                    }
                  />
                  <label className="form-check-label">
                    Chỉ hiện câu hỏi của bạn
                  </label>
                </div>
              </div>
              <div className="col-12">
                {question
                  .filter(
                    (question) =>
                      !listQuestion
                        .map((item) => item._id)
                        .includes(question._id)
                  )
                  .map((item, index) => (
                    <div className="mt-4">
                      <QuestionAdd key={index} question={item} />
                      <div className="text-end">
                        <button
                          className="btn btn-info"
                          onClick={() => handleAddQuesion(item._id)}
                        >
                          Thêm câu hỏi
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="col">
            <p className="fs-5">Số câu hỏi đã chọn {listQuestion.length}</p>
            {listQuestion?.map((item, index) => (
              <>
                <QuestionAdd key={index} question={item} />
                <div className="text-end">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemoveQuestion(item._id)}
                  >
                    Bỏ câu hỏi
                  </button>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomewordQuestion;
