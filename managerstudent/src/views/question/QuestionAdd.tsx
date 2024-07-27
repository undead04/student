import * as React from "react";
import { useState } from "react";
import { IQuestion } from "./../../servers/questionServer";
import { ITeacher } from "./../../servers/teacherServer";
interface PropQuestion {
  question: Partial<IQuestion>;
}
const QuestionAdd: React.FC<PropQuestion> = ({ question }) => {
  const listAnswer = ["A", "B", "C", "D", "E", "F"];
  return (
    <>
      <div className="row g-2">
        <div className="col-12 ">
          <p className="fw-bold fs-5 m-0">Nội dung câu hỏi:</p>
        </div>
        <hr />
        <div className="col-12">
          <div>1. {question.question}</div>
        </div>
        {question.option?.map((item, index) => (
          <div key={index} className="col-12">
            {`${listAnswer[index]}.  ${item}`}
          </div>
        ))}
        <hr />
      </div>

      <div className="row">
        <div className="col-auto">
          <p className="fw-bold fs-5 mb-2">
            Đáp án:{"   "}
            {question.answer?.map(
              (item, index) =>
                `${listAnswer[question.option?.indexOf(item) ?? -1]} `
            )}
          </p>
        </div>
        <div className="col-auto"></div>
      </div>
    </>
  );
};

export default QuestionAdd;
