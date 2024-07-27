import * as React from "react";
import { useState, useEffect } from "react";
import Input from "../../Components/Input";
import { IListSubject, ISubject } from "../../servers/subjectServer";
import SelectReact from "../../Components/SelectReact";
import { IClassRoom } from "../../servers/classServer";
import LoadingReact from "../../Components/LoadingReact";
import { IExamModel } from "../../servers/examServer";
interface Prop {
  handleChange: any;
  filterModel: any;
  handleChangeFilter: any;
  listSubject: ISubject[];
  listGrade: string[];
  listClassRoom: IClassRoom[];
  handleSelect: any;
  examModel: IExamModel;
  handleNext: any;
  handleCheck: any;
}
const ExamStep1: React.FC<Prop> = ({
  handleChange,
  filterModel,
  handleChangeFilter,
  listSubject,
  listGrade,
  listClassRoom,
  handleSelect,
  examModel,
  handleNext,
  handleCheck,
}) => {
  const [classRoom, setClassRoom] = useState<IClassRoom[]>([]);
  const [loadingForm, setLoadingForm] = useState(true);
  useEffect(() => {
    if (examModel.classRoomId.length > 0) {
      examModel.classRoomId.forEach((element) => {
        let objectClassRoom = listClassRoom.find((item) => item._id == element);
        if (objectClassRoom) {
          setClassRoom([...classRoom, objectClassRoom]);
        }
      });
    }

    setLoadingForm(false);
  }, []);
  return (
    <>
      <div className="container mt-3">
        {loadingForm === false ? (
          <>
            <div className="row g-3">
              <div className="col-12 col-sm-6 col-lg-4">
                <Input
                  onChange={handleChange}
                  name="name"
                  label="Tên đề kiểm tra"
                  value={examModel.name}
                />
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Môn học
                  </label>
                  <select
                    className="form-select"
                    name="subjectId"
                    onChange={handleChangeFilter}
                    value={filterModel.subjectId}
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
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Khối
                  </label>
                  <select
                    className="form-select"
                    name="grade"
                    value={filterModel.grade}
                    onChange={handleChangeFilter}
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
              <div className="col-12 col-sm-6 col-lg-4">
                <Input
                  name="startDate"
                  label="Thời gian mở"
                  value={examModel.startDate.toString()}
                  onChange={handleChange}
                  type="datetime-local"
                />
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <Input
                  name="endDate"
                  label="Thời gian kết thúc"
                  value={examModel.endDate.toString()}
                  onChange={handleChange}
                  type="datetime-local"
                />
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <Input
                  name="answerDate"
                  label="Thời gian xem kết quả"
                  value={examModel.answerDate.toString()}
                  onChange={handleChange}
                  type="datetime-local"
                />
              </div>
              <div className="col-auto align-content-center col-12 col-sm-6 col-lg-4">
                <div className="form-check mt-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="autoExam"
                    name="isAuto"
                    checked={filterModel.isAuto}
                    onChange={handleCheck}
                  />
                  <label className="form-check-label" htmlFor="autoExam">
                    Tạo đề tự động
                  </label>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <SelectReact
                  isMul={true}
                  option={listClassRoom.map((item, index) => ({
                    value: item._id,
                    label: item.name,
                  }))}
                  defaultValue={classRoom.map((item) => ({
                    value: item._id,
                    label: item.name,
                  }))}
                  name="classRoomId"
                  label="Lớp"
                  nameHandle={handleSelect}
                />
              </div>
              <div className="col-12 text-center mt-5">
                <button
                  className="btn btn-success rounded-pill px-4"
                  onClick={handleNext}
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          </>
        ) : (
          <LoadingReact />
        )}
      </div>
    </>
  );
};

export default ExamStep1;
