import * as React from "react";
import { useState } from "react";
import { ISelectQuestion } from "./ExamCreate";
interface Prop {
  selectQuestion: ISelectQuestion;
  handleEdit: any;
}
const QuestionCustom: React.FC<Prop> = ({ selectQuestion, handleEdit }) => {
  return (
    <>
      <div className="card mb-3">
        <div className="bg-success-subtle">
          {selectQuestion.tableOfContents}
        </div>
        <div className="card-body">
          <p className="card-text">
            Số câu hỏi đã chọn {selectQuestion.question.length}
          </p>

          <button
            className="btn bg-info-subtle"
            onClick={() => handleEdit(selectQuestion)}
          >
            Chỉnh sữa câu hỏi
          </button>
        </div>
      </div>
    </>
  );
};

export default QuestionCustom;
