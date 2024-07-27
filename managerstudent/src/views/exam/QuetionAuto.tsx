import * as React from "react";
import { useState } from "react";
import { ISelectQuestion } from "./ExamCreate";
import Input from "../../Components/Input";
interface Prop {
  selectQuestion: ISelectQuestion;
  handleChange: any;
}
const QuestionAuto: React.FC<Prop> = ({ selectQuestion, handleChange }) => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="card rounded-1">
              <div className="card-header bg-primary fw-bold text-light rounded-1">
                {selectQuestion.tableOfContents}
              </div>
              <div className="card-body">
                <div className="container">
                  <div className="row">
                    <div className="col-3">
                      <Input
                        label="Số câu thấp"
                        name="numberLowQuestion"
                        type="number"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-3">
                      <Input
                        label="Số câu trung bình"
                        name="numberMediumQuestion"
                        type="number"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-3">
                      <Input
                        label="Số câu cao"
                        name="numberHightQuestion"
                        type="number"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionAuto;
