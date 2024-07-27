import * as React from "react";
import { useState } from "react";
import { ISubjectDetail } from "../../servers/subjectDetailServer";
import { ISelectQuestion } from "./HomeworkCreate";
import styled from "styled-components";
interface Prop {
  subjectDetail: ISubjectDetail[];
  handleCheckMultiple: any;
  selectQuestion: ISelectQuestion[];
  handleNext: any;
  handlePre: any;
  handleEdit: any;
}
const ScrollableContainer = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;
const HomeworkStep2: React.FC<Prop> = ({
  subjectDetail,
  handleCheckMultiple,
  selectQuestion,
  handleNext,
  handlePre,
  handleEdit,
}) => {
  return (
    <>
      <div className="container mt-3 h-50">
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
            {selectQuestion.map((item, index) => (
              <div className="card mb-3" key={index}>
                <div className="bg-success-subtle">{item.tableOfContents}</div>
                <div className="card-body">
                  <p className="card-text">
                    Số câu hỏi đã chọn {item.question.length}
                  </p>

                  <button
                    className="btn bg-info-subtle"
                    onClick={() => handleEdit(item)}
                  >
                    Chỉnh sữa câu hỏi
                  </button>
                </div>
              </div>
            ))}
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

export default HomeworkStep2;
