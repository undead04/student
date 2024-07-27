import * as React from "react";
import { useState } from "react";
import { ISubjectDetail } from "../../servers/subjectDetailServer";
import styled from "styled-components";
import { ISelectQuestion } from "./ExamCreate";
import QuestionCustom from "./QuestionCustom";
import QuestionAuto from "./QuetionAuto";
interface Prop {
  subjectDetail: ISubjectDetail[];
  handleCheckMultiple: any;
  selectQuestion: ISelectQuestion[];
  handleNext: any;
  handlePre: any;
  handleEdit: any;
  filterModel: any;
  handlechange: any;
}
const ScrollableContainer = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;
const ExamStep2: React.FC<Prop> = ({
  subjectDetail,
  handleCheckMultiple,
  selectQuestion,
  handleNext,
  handlePre,
  handleEdit,
  filterModel,
  handlechange,
}) => {
  return (
    <>
      <div className="container mt-3">
        <div className="row g-3 mt-3">
          <div className="col-12">
            <p className="fs-5  bg-success rounded-top-3 text-light p-2 fw-bold">
              Chọn câu hỏi vào các ô trống
            </p>
          </div>
        </div>
        <div className="row g-2">
          <div className="col-4 border-end">
            <div className="col-12">
              <p className="bg-success text-light p-2 fw-bold">Mục lục ----</p>
            </div>
            <div className="ms-4">
              <ScrollableContainer>
                {subjectDetail.map((item) =>
                  item.tableOfContents.map((table, index) => (
                    <div className="form-check" key={index}>
                      <input
                        className="form-check-input p-1"
                        type="checkbox"
                        id="flexCheckChecked"
                        name="tableOfContent"
                        value={table}
                        onChange={handleCheckMultiple}
                        checked={selectQuestion.some(
                          (item) => item.tableOfContents === table
                        )}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckChecked"
                      >
                        {table}
                      </label>
                    </div>
                  ))
                )}
              </ScrollableContainer>
            </div>
          </div>
          <div className="col">
            <div className="row g-3">
              <div className="col-12">
                <p className="fw-bold text-warning">
                  PHÂN BỐ CÂU HỎI THEO MỨC ĐỘ (0.25)
                </p>
              </div>
              {selectQuestion.map((item, index) =>
                filterModel.isAuto ? (
                  <div className="col-12">
                    <QuestionAuto
                      key={index}
                      selectQuestion={item}
                      handleChange={(e: any) => handlechange(index, e)}
                    />
                  </div>
                ) : (
                  <div className="col-12">
                    <QuestionCustom
                      selectQuestion={item}
                      handleEdit={handleEdit}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className="row justify-content-around mt-5">
          <div className="col-auto ">
            <button className="btn " onClick={handlePre}>
              <i className="fa-solid fa-arrow-left"></i> Quay về
            </button>
          </div>
          <div className="col-auto">
            <button
              className="btn btn-success rounded-pill px-4"
              onClick={handleNext}
            >
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExamStep2;
