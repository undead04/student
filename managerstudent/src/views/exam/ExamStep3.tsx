import * as React from "react";
import { useState, useEffect } from "react";
import subjectDetailService, {
  ISubjectDetail,
} from "../../servers/subjectDetailServer";
import { IExamModel } from "../../servers/examServer";
import classService, { IClassRoom } from "../../servers/classServer";
import studentService, { IStudent } from "../../servers/studentServer";
interface Prop {
  examModel: IExamModel;
  handlePre: any;
  handleSave: any;
  setSelectStudent: React.Dispatch<React.SetStateAction<string[]>>;
  selectStudent: string[];
}
const ExamStep3: React.FC<Prop> = ({
  examModel,
  handleSave,
  handlePre,
  setSelectStudent,
  selectStudent,
}) => {
  const [classRoom, setClassRoom] = useState<IClassRoom[]>([]);
  const [listStudent, setListStudent] = useState<IStudent[]>([]);
  const [checkAll, setCheckAll] = useState(false);
  useEffect(() => {
    if (examModel.classRoomId) {
      const fetchQuestions = async () => {
        const promises = examModel.classRoomId.map((element) =>
          classService.get(element)
        );
        const promisesStudent = examModel.classRoomId.map((element) =>
          studentService.list(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            element
          )
        );
        const results = await Promise.all(promises);
        const resultsStudent = await Promise.all(promisesStudent);
        const array: IClassRoom[] = results.map((res) => res.data);
        const arrayStudent: IStudent[] = resultsStudent.flatMap(
          (res) => res.data.student
        );
        setClassRoom(array);
        setListStudent(arrayStudent);
      };
      fetchQuestions();
    }
  }, []);
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setCheckAll(isChecked);
    if (isChecked) {
      const allStudentIds = listStudent.map((student) => student._id);
      setSelectStudent(allStudentIds);
    } else {
      setSelectStudent([]);
    }
  };
  const handleStudentCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const studentId = event.target.value;
    const isChecked = event.target.checked;
    setSelectStudent(() => {
      if (isChecked) {
        return [...selectStudent, studentId];
      } else {
        return selectStudent.filter((id: string) => id !== studentId);
      }
    });
    if (selectStudent.filter((id: string) => id !== studentId).length === 0) {
      setCheckAll(false);
    }
  };
  return (
    <>
      <div className="container mt-3 h-75">
        <div className="row">
          <div className="col-12 text-end ">
            <button className="btn btn-warning text-light fw-bold">
              Xem bài tập về nhà
            </button>
          </div>
        </div>
        <div className="row border mt-4">
          <div className="col-12 mt-3">
            <div className="form-check">
              <label className="form-check-label" htmlFor="choice">
                Chọn tất cả
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                id="choice"
                checked={checkAll}
                onChange={handleSelectAll}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="accordion accordion-flush" id="classRoom">
              {classRoom.map((item, index) => (
                <div className="accordion-item" key={index}>
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#${item.name}`}
                      aria-expanded="false"
                      aria-controls={item.name}
                    >
                      {item.name}
                    </button>
                  </h2>
                  <div
                    id={item.name}
                    className="accordion-collapse collapse"
                    data-bs-parent="classRoom"
                  >
                    <div className="accordion-body">
                      <table className="table table-border">
                        <thead>
                          <tr>
                            <th scope="col"></th>
                            <th scope="col">STT</th>
                            <th scope="col">Tên học sinh</th>
                            <th scope="col">Lớp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listStudent
                            .filter(
                              (student) => student.classRoom._id === item._id
                            )
                            .map((student, index) => (
                              <tr key={index}>
                                <th scope="row">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value={student._id}
                                      checked={selectStudent.includes(
                                        student._id
                                      )}
                                      onChange={handleStudentCheckboxChange}
                                    />
                                  </div>
                                </th>
                                <th>{index + 1}</th>
                                <td>{student.name}</td>
                                <td>{item.name}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
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
              onClick={handleSave}
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExamStep3;
