import * as React from "react";
import { useState, useEffect } from "react";
import subjectService, { ISubject } from "../../servers/subjectServer";
import questionService, {
  IQuestion,
  IQuestionModel,
} from "../../servers/questionServer";
import subjectDetailService, {
  ISubjectDetail,
} from "../../servers/subjectDetailServer";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const QuestionCreate = () => {
  const [questionModel, setQuestionModel] = useState<IQuestionModel[]>([]);
  const [indexQuestion, setIndexQuestion] = useState(0);
  const { id } = useParams();
  const [listSubject, setListSubject] = useState<ISubject[]>([]);
  const [subjectDetail, setSubjectDetail] = useState<ISubjectDetail[]>([]);
  const [question, setQuestion] = useState<IQuestion>();
  const listGrade = ["10", "11", "12"];
  const listLevel = ["Thấp", "Trung bình", "Cao"];
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectResponse = await subjectService.list();
        setListSubject(subjectResponse.data.subject);
        if (id !== undefined) {
          const questionResponse = await questionService.get(id);
          setQuestion(questionResponse.data);
          setIndexQuestion(0);
          setQuestionModel([
            {
              question: questionResponse.data.question,
              level: questionResponse.data.level,
              answer: questionResponse.data.answer,
              isMul: questionResponse.data.isMul,
              tableOfContents: questionResponse.data.tableOfContents,
              option: questionResponse.data.option,
              subjectDetailId: questionResponse.data.subjectDetail._id,
              subjectId: questionResponse.data.subjectDetail.subject._id,
              grade: questionResponse.data.subjectDetail.grade.toString(),
            },
          ]);
        } else {
          setQuestionModel([
            {
              question: "",
              level: -1,
              answer: [],
              isMul: false,
              tableOfContents: "",
              option: [],
              subjectDetailId: "",
              subjectId: "",
              grade: "",
            },
          ]);
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    try {
      if (
        questionModel[indexQuestion]?.grade &&
        questionModel[indexQuestion]?.subjectId
      ) {
        subjectDetailService
          .list(
            questionModel[indexQuestion]?.subjectId,
            questionModel[indexQuestion]?.grade.toString()
          )
          .then((res) => {
            const newQuestion = [...questionModel];
            const questionIndex = newQuestion[indexQuestion];
            newQuestion[indexQuestion] = {
              ...questionIndex,
              subjectDetailId: res.data[0]?._id,
            };
            setQuestionModel(newQuestion);
            setSubjectDetail(res.data);
          });
      }
    } catch (error: any) {
      console.log(error);
    }
  }, [
    questionModel[indexQuestion]?.grade,
    questionModel[indexQuestion]?.subjectId,
  ]);
  const handleAddQuestion = () => {
    setQuestionModel([
      ...questionModel,
      {
        question: "",
        option: [],
        answer: [],
        isMul: false,
        subjectDetailId: "",
        tableOfContents: "",
        level: -1,
        subjectId: "",
        grade: "",
      } as IQuestionModel,
    ]);
  };
  const handleDeleteQuestion = (index: number) => {
    const newItem = questionModel.filter((item, i) => i !== index);
    setIndexQuestion(index - 1);
    setQuestionModel(newItem);
  };
  const handleAddTableOfContents = (indexQuestion: number) => {
    let newQuestion = [...questionModel];
    let questionIndex = newQuestion[indexQuestion];
    let newItem = [...questionIndex.option, ""];
    newQuestion[indexQuestion] = {
      ...questionIndex,
      option: newItem,
    };
    setQuestionModel(newQuestion);
  };
  const handleChange = (
    index: number,
    e: React.FormEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    let newQuestion = [...questionModel];
    let questionIndex = newQuestion[index];
    newQuestion[index] = {
      ...questionIndex,
      [e.currentTarget.name]: e.currentTarget.value,
    };
    setQuestionModel(newQuestion);
  };
  const handleChangeCheckIsMul = (
    index: number,
    e: React.FormEvent<HTMLInputElement>
  ) => {
    let newQuestion = [...questionModel];
    let questionIndex = newQuestion[index];
    newQuestion[index] = {
      ...questionIndex,
      [e.currentTarget.name]: e.currentTarget.checked,
      answer: [],
    };

    setQuestionModel(newQuestion);
  };
  const handleDeleteTableOfContents = (
    indexQuestion: number,
    index: number
  ) => {
    let newQuestion = [...questionModel];
    let questionIndex = newQuestion[indexQuestion];
    const newItems = questionIndex.option.filter((item, i) => i != index); // Lọc bỏ phần tử tại vị trí index
    newQuestion[indexQuestion] = {
      ...questionIndex,
      option: newItems,
    };
    setQuestionModel(newQuestion);
  };
  const handleSave = async () => {
    if (id === undefined) {
      try {
        questionModel.forEach((element) => {
          questionService.add({
            ...element,
            subjectDetailId: element.subjectDetailId,
            level: element.level ?? 0,
            tableOfContents: element.tableOfContents,
          });
        });

        handleNavigate();
        toast.success("Tạo câu hỏi thành công");
      } catch (error) {
        toast.error("Tạo câu hỏi thất bại");
        console.log(error);
      }
    } else {
      try {
        await questionService.update(id, {
          ...questionModel[indexQuestion],
          subjectDetailId: questionModel[indexQuestion].subjectDetailId,
          level: questionModel[indexQuestion].level ?? 0,
          tableOfContents: questionModel[indexQuestion].tableOfContents,
        });
        toast.success("Cập nhập câu hỏi thành công");
        handleNavigate();
      } catch (error: any) {
        toast.error("Cập nhập câu hỏi thất bại");
        console.log(error);
      }
    }
  };
  const handleChangeRadio = (
    indexQuestion: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newQuestion = [...questionModel];
    let questionIndex = newQuestion[indexQuestion];
    const newItem: string[] = [event.currentTarget.value];
    newQuestion[indexQuestion] = {
      ...questionIndex,
      [event.currentTarget.name]: newItem,
    };
    setQuestionModel(newQuestion);
  };
  const handleNavigate = () => {
    navigate("/question");
  };
  const handleChangeArray = (
    indexQuestion: number,
    index: number,
    newValue: React.FormEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    let newQuestion = [...questionModel];
    let questionIndex = newQuestion[indexQuestion];
    const newItems: string[] = [...questionIndex.option]; // Tạo một bản sao của mảng hiện tại
    newItems[index] = newValue.currentTarget.value; // Cập nhật giá trị mới vào vị trí index
    newQuestion[indexQuestion] = {
      ...questionIndex,
      option: newItems,
    };
    setQuestionModel(newQuestion);
  };
  const handleChangeCheck = (
    indexQuestion: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isCheck = e.currentTarget.checked;
    if (isCheck) {
      let newQuestion = [...questionModel];
      let questionIndex = newQuestion[indexQuestion];
      const newItem: string[] = [...questionIndex.answer];
      newItem.push(e.currentTarget.value);
      newQuestion[indexQuestion] = {
        ...questionIndex,
        [e.currentTarget.name]: newItem,
      };
      setQuestionModel(newQuestion);
    } else {
      let newQuestion = [...questionModel];
      let questionIndex = newQuestion[indexQuestion];
      const newItem: string[] = questionIndex.answer.filter(
        (item, i) => item !== e.currentTarget.value
      );
      newQuestion[indexQuestion] = {
        ...questionIndex,
        answer: newItem,
      };
      setQuestionModel(newQuestion);
    }
  };
  console.log(indexQuestion);
  return (
    <>
      <div className="container mt-3">
        <div className="row g-3">
          <div className="col-12 col-sm-4 col-lg-3">
            <div className="form-group">
              <label htmlFor="" className="form-label">
                Môn học
              </label>
              <select
                className="form-select"
                name="subjectId"
                value={questionModel[indexQuestion]?.subjectId}
                onChange={(e) => handleChange(indexQuestion, e)}
              >
                <option value="" disabled hidden>
                  Chọn môn học
                </option>
                {listSubject.map((item, index) => (
                  <option value={item._id} key={index}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-12 col-sm-4 col-lg-3">
            <div className="form-group">
              <label htmlFor="" className="form-label">
                Khối lớp
              </label>
              <select
                className="form-select"
                name="grade"
                value={questionModel[indexQuestion]?.grade}
                onChange={(e) => handleChange(indexQuestion, e)}
              >
                <option value="" disabled hidden>
                  Chọn khối
                </option>
                {listGrade.map((item, index) => (
                  <option value={item} key={index}>
                    Khối {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-12 col-sm-4 col-lg-3">
            <div className="form-group">
              <label htmlFor="" className="form-label">
                Mức độ
              </label>
              <select
                className="form-select"
                name="level"
                value={questionModel[indexQuestion]?.level}
                onChange={(e) => handleChange(indexQuestion, e)}
              >
                <option value={-1} hidden>
                  Chọn mức độ
                </option>
                {listLevel.map((item, index) => (
                  <option value={index.toString()} key={index}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-12 col-sm-4 col-lg-3">
            <div className="form-group">
              <label htmlFor="" className="form-label">
                Chủ đề
              </label>
              <select
                className="form-select"
                name="tableOfContents"
                value={questionModel[indexQuestion]?.tableOfContents}
                onChange={(e) => handleChange(indexQuestion, e)}
              >
                <option value="" disabled hidden>
                  Chọn chủ đề
                </option>
                {subjectDetail.map((item, index) =>
                  item.tableOfContents.map((table, index) => (
                    <option value={table}>{table}</option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>
        <div className="row mt-4 g-2">
          {id === undefined && (
            <div className="col-3">
              <div className="row">
                <div className="col-12">
                  <p className="fw-bold">Câu hỏi</p>
                </div>
                {questionModel.map((item, index) => (
                  <div className="col-12" key={index}>
                    <p
                      className={`text-center fw-bold ${
                        indexQuestion == index && "bg-warning"
                      }`}
                      onClick={() => setIndexQuestion(index)}
                    >
                      Câu {index + 1}{" "}
                    </p>
                  </div>
                ))}
                <div className="col-12">
                  <div className="text-center mt-2" onClick={handleAddQuestion}>
                    <button className="btn btn-info">
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {indexQuestion >= 0 && (
            <div className="col">
              <div className="col-12 ">
                <div>
                  <label
                    htmlFor="question"
                    className="form-label text-info fw-bold fs-5 mb-2"
                  >
                    Câu hỏi {indexQuestion + 1}:
                  </label>
                  <input
                    type="text"
                    className="form-control ms-4"
                    id="question"
                    name="question"
                    placeholder="Vui lòng nhập nội dung"
                    onChange={(e) => handleChange(indexQuestion, e)}
                    value={questionModel[indexQuestion]?.question}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="multiple"
                    name="isMul"
                    checked={questionModel[indexQuestion]?.isMul}
                    onChange={(e) => handleChangeCheckIsMul(indexQuestion, e)}
                  />
                  <label className="form-check-label" htmlFor="multiple">
                    Câu hỏi có nhiều đáp án
                  </label>
                </div>
              </div>
              <div className="col-12  mt-3">
                <p className="form-label text-info fw-bold fs-5 mb-2">
                  Câu trả lời
                </p>
              </div>
              {questionModel[indexQuestion]?.option.map((item, index) => (
                <>
                  <div className="row ms-4">
                    <div className="col">
                      <div className="input-group mb-3">
                        <div className="input-group-text">
                          <input
                            className="form-check-input mt-0"
                            type={
                              questionModel[indexQuestion]?.isMul
                                ? "checkbox"
                                : "radio"
                            }
                            name="answer"
                            checked={
                              questionModel[indexQuestion]?.isMul
                                ? questionModel[indexQuestion].answer.includes(
                                    item
                                  )
                                : questionModel[indexQuestion]?.answer.some(
                                    (answer) => answer == item
                                  )
                            }
                            value={item}
                            onChange={
                              questionModel[indexQuestion]?.isMul
                                ? (e) => handleChangeCheck(indexQuestion, e)
                                : (e) => handleChangeRadio(indexQuestion, e)
                            }
                          />
                        </div>
                        <input
                          type="text"
                          value={item}
                          className="form-control"
                          name="option"
                          onChange={(e) =>
                            handleChangeArray(indexQuestion, index, e)
                          }
                        />
                      </div>
                    </div>
                    <div className="col-auto">
                      <button
                        className="btn btn-danger rounded-circle"
                        onClick={() =>
                          handleDeleteTableOfContents(indexQuestion, index)
                        }
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </>
              ))}
              <div className="col-12 text-start">
                <button
                  className="btn btn-success rounded-circle"
                  onClick={() => handleAddTableOfContents(indexQuestion)}
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
                <span className="">Thêm câu trả lời mới</span>
              </div>
              <div className="col-12 text-end mb-5 ">
                <button
                  className="btn btn-danger px-4 me-3"
                  onClick={() => handleDeleteQuestion(indexQuestion)}
                >
                  Hủy
                </button>
                <button className="btn btn-success px-4" onClick={handleSave}>
                  Lưu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default QuestionCreate;
