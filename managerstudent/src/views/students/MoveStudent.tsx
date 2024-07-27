import * as React from "react";
import { useState, useEffect } from "react";
import classService, { IClassRoom } from "../../servers/classServer";
import studentService, { IStudent } from "../../servers/studentServer";
import ModalReact from "../../Components/ModalReact";
import moveStudentServer, {
  IMoveStudentModel,
} from "../../servers/moveStudentServer";
import MoveStudentAdd from "./MoveStudentAdd";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
const MoveStudent = () => {
  const listGrade = ["10", "11", "12"];
  const [searchParams, setSearchParams] = useSearchParams();
  const [grade, setGrade] = useState<string>(searchParams.get("grade") || "");
  const [classRoom, setClassRoom] = useState<string>(
    searchParams.get("classRoom") || ""
  );
  const [listClassRoom, setListClassRoom] = useState<IClassRoom[]>([]);
  const [listStudent, setListStudent] = useState<IStudent[]>([]);
  const [studentId, setStudentId] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const [moveGrade, setMoveGrade] = useState<string>("");
  const [moveStudentModel, setMoveStudentModel] = useState<IMoveStudentModel>({
    studentId: [],
    classRoomId: "",
  });
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    if (grade) {
      classService.list(grade).then((res) => setListClassRoom(res.data));
    }
  }, [grade]);
  const loadData = async () => {
    studentService
      .list(undefined, undefined, undefined, undefined, undefined, classRoom)
      .then((res) => setListStudent(res.data.student));
    setStudentId([]);
    setCheckAll(false);
  };
  useEffect(() => {
    if (classRoom) {
      loadData();
    }
  }, [classRoom]);
  useEffect(() => {
    const params: Record<string, string> = {};
    if (grade) {
      params["grade"] = String(grade);
    }
    if (classRoom) {
      params["classRoom"] = String(classRoom);
    }
    setSearchParams(params);
  }, [grade, classRoom]);
  const handleCheckAll = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const isCheck = e.currentTarget.checked;
    setCheckAll(isCheck);
    if (isCheck) {
      const studentId = listStudent.map((item) => item._id);
      setStudentId(studentId);
    } else {
      setStudentId([]);
    }
  };
  const handleCheck = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const isCheck = e.currentTarget.checked;
    if (isCheck) {
      setStudentId([...studentId, e.currentTarget.value]);
    } else {
      const newStudnentId = studentId.filter(
        (item) => item !== e.currentTarget.value
      );
      setStudentId(newStudnentId);
    }
  };
  const handleShow = () => {
    setShow(true);
    setMoveStudentModel({ ...moveStudentModel, classRoomId: "" });
    setMoveGrade("");
  };
  const handleClose = () => setShow(false);
  const handleSave = async () => {
    try {
      await moveStudentServer.put({
        ...moveStudentModel,
        studentId: studentId,
      });
      handleClose();
      toast.success("Chuyển học sinh thành công");
      loadData();
    } catch (error: any) {
      toast.error("Chuyển học sinh thất bại");
    }
  };
  const handleChange = (e: React.FormEvent<HTMLSelectElement>) => {
    setMoveStudentModel({
      ...moveStudentModel,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  return (
    <>
      <ModalReact
        handleClose={handleClose}
        handleSave={() => handleSave()}
        title={`Chuyển lớp cho học sinh`}
        labelClose="Đóng"
        labelSave="Xác nhận chuyển lớp"
        data={
          <MoveStudentAdd
            listGrade={listGrade}
            moveStudentModel={moveStudentModel}
            handleChange={handleChange}
            grade={moveGrade}
            setGrade={setMoveGrade}
          />
        }
        show={show}
      />
      <div className="container mt-3" style={{ maxWidth: "80%" }}>
        <div className="row">
          <div className="col-12">
            <p className="fs-4 text-center">CHUYỂN / NÂNG LỚP CHO HỌC SINH</p>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-4">
            <select
              className="form-select"
              value={grade}
              onChange={(e) => {
                setGrade(e.currentTarget.value);
                setClassRoom("");
              }}
            >
              <option value="" hidden>
                Chọn khối
              </option>
              {listGrade.map((item, index) => (
                <option value={item} key={index}>
                  Khối {item}
                </option>
              ))}
            </select>
          </div>
          <div className="col-4">
            <select
              className="form-select"
              value={classRoom}
              onChange={(e) => setClassRoom(e.currentTarget.value)}
            >
              <option value={""} hidden>
                Chọn lớp
              </option>
              {listClassRoom.map((item, index) => (
                <option value={item._id} key={index}>
                  Lớp {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {grade && classRoom ? (
          <div>
            <div className="row mt-3 align-items-center">
              <div className="col-auto">
                <p className="fw-bold fw-bolder fs-6 mb-0">
                  Lựa chọn học sinh chuyển lớp ({studentId.length})
                </p>
              </div>
              <div className="col-auto">
                <button
                  className={`btn ${
                    studentId.length >= 1 ? "btn-info" : "bg-primary-subtle"
                  }`}
                  onClick={handleShow}
                >
                  <i className="fa-regular fa-calendar-check"></i> Chuyển lớp
                </button>
              </div>
            </div>
            {listStudent.length > 0 ? (
              <>
                <div className="row mt-3">
                  <div className="col">
                    <table className="table ">
                      <thead className="table-success ">
                        <tr>
                          <th scope="col">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              onChange={handleCheckAll}
                              checked={checkAll}
                            />
                          </th>
                          <th scope="col">Số thứ tự</th>
                          <th scope="col">Tên học sinh</th>
                          <th scope="col">Ngày sinh</th>
                          <th scope="col">Khối</th>
                          <th scope="col">Lớp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listStudent.map((item, index) => (
                          <tr key={index}>
                            <th scope="row">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                value={item._id}
                                checked={studentId.includes(item._id)}
                                onChange={handleCheck}
                              />
                            </th>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.dateOfBirth.toString().split("T")[0]}</td>
                            <td>{item.classRoom.grade}</td>
                            <td>{item.classRoom.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default MoveStudent;
