import * as React from "react";
import { useState, useEffect } from "react";
import Input from "../../Components/Input";
import { ISubject } from "../../servers/subjectServer";
import SelectReact from "../../Components/SelectReact";
import { IClassRoom } from "../../servers/classServer";
import { IHomeworkModel } from "../../servers/homeworkServer";
import LoadingReact from "../../Components/LoadingReact";
interface Prop {
  handleChange: any;
  filterModel: any;
  handleChangeFilter: any;
  listSubject: ISubject[];
  listGrade: string[];
  listClassRoom: IClassRoom[];
  handleSelect: any;
  examModel: IHomeworkModel;
  handleNext: any;
}
const HomeworkStep1: React.FC<Prop> = ({
  handleChange,
  filterModel,
  handleChangeFilter,
  listSubject,
  listGrade,
  listClassRoom,
  handleSelect,
  examModel,
  handleNext,
}) => {
  const [classRoom, setClassRoom] = useState<IClassRoom[]>([]);
  const [loadingForm, setLoadingForm] = useState(true);
  useEffect(() => {
    if (examModel.classRoomId.length > 0) {
      const objectClassRoom = listClassRoom.filter((item) =>
        examModel.classRoomId.includes(item._id)
      );
      setClassRoom(objectClassRoom);
    } else {
      setClassRoom([]);
    }
    setLoadingForm(false);
  }, [examModel.classRoomId]);
  console.log(classRoom);
  return (
    <>
      <div className="container mt-3" style={{ maxWidth: 500 }}>
        {loadingForm === false ? (
          <>
            <div className="row g-3">
              <div className="col-12">
                <Input
                  onChange={handleChange}
                  name="name"
                  label="Tên bài tập về nhà"
                  value={examModel.name}
                />
              </div>
              <div className="col-12  col-lg-6">
                <Input
                  name="startDate"
                  label="Ngày bắt đầu"
                  value={examModel.startDate.toString()}
                  onChange={handleChange}
                  type="datetime-local"
                />
              </div>
              <div className="col-12  col-lg-6">
                <Input
                  name="endDate"
                  label="Ngày kết thúc"
                  value={examModel.endDate.toString()}
                  onChange={handleChange}
                  type="datetime-local"
                />
              </div>
              <div className="col-12 col-lg-6">
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
              <div className="col-12  col-lg-6">
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
              <div className="col-12">
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
              <div className="col-12 text-center">
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

export default HomeworkStep1;
