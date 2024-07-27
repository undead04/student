import * as React from "react";
import { useState, useEffect } from "react";
import classService, { IClassRoom } from "../../servers/classServer";
import { IChangePassword, IValidationStudent } from "../../models/Validation";
import ModalReact from "../../Components/ModalReact";
import studentService, {
  IListStudent,
  IStudent,
  IStudentModel,
} from "../../servers/studentServer";
import PaginationRect from "../../Components/PaginationReact";
import StudentAdd from "./StudentAdd";
import Input from "../../Components/Input";
import changePasswordService, {
  PasswordModel,
} from "../../servers/changePasswordServer";
import FileSaver from "file-saver";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
type filterModel = {
  search: string;
  subjectId: string;
  page: number;
  order: string;
  sortBy: string;
  grade: string;
  classRoom: string;
};
const StudentView = () => {
  const [listStudent, setListStudent] = useState<IListStudent>();
  const [searchParams, setSearchParams] = useSearchParams();
  const listGrade = ["10", "11", "12"];
  const [className, setclassName] = useState<string>();
  const [studentModel, setStudentModel] = useState<IStudentModel>({
    name: "",
    codeUser: "",
    address: "",
    cccd: "",
    phone: "",
    dateOfBirth: "",
    classRoomId: "",
    username: "",
    password: "",
    sex: 0,
    email: "",
  });
  const [listClassRoom, setListClassRoom] = useState<IClassRoom[]>([]);
  const [student, setStudent] = useState<Partial<IStudent>>({ _id: "" });
  const [message, setMessage] = useState<IValidationStudent>({
    name: "",
    codeUser: "",
    address: "",
    cccd: "",
    phone: "",
    dateOfBirth: "",
    username: "",
    password: "",
    sex: "",
    email: "",
  });
  const [MessagePassword, setMessagePassword] = useState<IChangePassword>({
    newPassword: "",
    comfimPassword: "",
  });
  const [password, setPassword] = useState<PasswordModel>({
    newPassword: "",
    comfimPassword: "",
  });
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showChangePassowrd, setShowChangePassowrd] = useState(false);
  const [loadingForm, setLoadingForm] = useState(true);
  const [loading, setLoading] = useState(true);
  const [filterModel, setFilterModel] = useState<filterModel>({
    search: searchParams.get("search") || "",
    grade: searchParams.get("grade") || "",
    classRoom: searchParams.get("classRoom") || "",
    subjectId: searchParams.get("subjectId") || "",
    page: Number(searchParams.get("page")) || 1,
    sortBy: searchParams.get("sortBy") || "",
    order: searchParams.get("order") || "",
  });
  const loadData = async (
    search?: string,
    page?: number,
    pageSize?: number,
    sortBy?: string,
    order?: string,
    classRoom?: string
  ) => {
    try {
      await studentService
        .list(search, page, pageSize, sortBy, order, classRoom)
        .then((res) => setListStudent(res.data));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (filterModel.grade) {
      classService
        .list(filterModel.grade)
        .then((res) => setListClassRoom(res.data));
    }
  }, [filterModel.grade]);
  useEffect(() => {
    const params: Record<string, string> = {};
    (Object.keys(filterModel) as Array<keyof filterModel>).forEach((key) => {
      const value = filterModel[key];
      if (value !== undefined && value !== null && value) {
        params[key] = String(value); // Chuyển đổi giá trị sang chuỗi
      }
    });
    setSearchParams(params);
  }, [filterModel]);
  useEffect(() => {
    if (filterModel.classRoom) {
      loadData(
        "",
        filterModel.page,
        10,
        filterModel.sortBy,
        filterModel.order,
        filterModel.classRoom
      );
      let objectClassName = listClassRoom.find(
        (item) => item._id == filterModel.classRoom
      );
      setclassName(objectClassName?.name);
    }
  }, [filterModel.classRoom]);
  const handleShow = async (id: string) => {
    setStudent({
      _id: "",
      name: "",
    });
    setMessage({
      name: "",
      codeUser: "",
      address: "",
      cccd: "",
      phone: "",
      dateOfBirth: "",
      username: "",
      password: "",
      sex: "",
      email: "",
    });
    if (id !== "") {
      await handleGet(id);
    } else {
      setStudentModel({
        name: "",
        codeUser: "",
        address: "",
        cccd: "",
        phone: "",
        dateOfBirth: new Date().toISOString().split("T")[0],
        classRoomId: filterModel.classRoom,
        username: "",
        password: "",
        sex: 0,
        email: "",
      });
    }
    setLoadingForm(false);
    setShow(true);
  };
  const handleShowDelete = async (id: string) => {
    await handleGet(id);
    setLoadingForm(false);
    setShowDelete(true);
  };
  const handleCloseDelete = () => {
    setShowDelete(false);
    setLoadingForm(true);
  };
  const handleClose = () => {
    setShow(false);
    setLoadingForm(true);
  };
  const handleSave = async (id: string) => {
    if (id === "") {
      try {
        const response = await studentService.add(studentModel); // Gọi service để thêm country
        handleClose(); // Đóng modal
        loadData(
          "",
          filterModel.page,
          10,
          filterModel.sortBy,
          filterModel.order,
          filterModel.classRoom
        ); // Tải dữ liệu mới
        toast.success("Tạo học sinh thành công");
      } catch (error: any) {
        toast.error("Tạo học sinh thất bại");
        setMessage(error.response.data.errors);
      }
    } else {
      try {
        const response = await studentService.update(id, studentModel);
        handleClose(); // Đóng modal
        loadData(
          "",
          filterModel.page,
          10,
          filterModel.sortBy,
          filterModel.order,
          filterModel.classRoom
        ); // Tải dữ liệu mới
        toast.warning("Cập nhập học sinh thành công");
      } catch (error: any) {
        toast.error("Cập nhập học sinh thất bại");
        setMessage(error.response.data.errors);
      }
    }
  };
  const handleGet = async (id: string) => {
    try {
      var repository = await studentService.get(id);
      console.log(repository);
      setStudent(repository.data);
      setStudentModel({
        name: repository.data.name,
        codeUser: repository.data.codeUser,
        classRoomId: repository.data.classRoom._id,
        cccd: repository.data.cccd,
        email: repository.data.email,
        phone: repository.data.phone,
        address: repository.data.address,
        dateOfBirth: repository.data.dateOfBirth.toString().split("T")[0],
        username: repository.data.user.username,
        password: repository.data.user.password,
        sex: repository.data.sex,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (
    e: React.FormEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setStudentModel({
      ...studentModel,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  const handleSelect = (e: string | string[], name: string) => {
    setStudentModel({ ...studentModel, [name]: e });
  };
  const handleDelete = async (id: string) => {
    try {
      await studentService.remove(id);
      handleCloseDelete();
      loadData(
        "",
        filterModel.page,
        10,
        filterModel.sortBy,
        filterModel.order,
        filterModel.classRoom
      ); // Tải dữ liệu mới
      toast.success("Xóa học sinh thành công");
    } catch (error: any) {
      toast.error("Xóa học sinh thất bại");
    }
  };
  const handlePageChange = (page: number) => {
    setFilterModel({ ...filterModel, page: page });
  };
  const handleChangeClassRoom = (e: React.FormEvent<HTMLSelectElement>) => {
    if (e.currentTarget.name == "grade") {
      filterModel.classRoom = "";
    }
    setFilterModel({
      ...filterModel,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  const handleChangePassword = (e: React.FormEvent<HTMLInputElement>) => {
    setPassword({
      ...password,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  const handleShowChangePassword = async (id: string) => {
    await handleGet(id);
    setPassword({
      newPassword: "",
      comfimPassword: "",
    });
    setShowChangePassowrd(true);
    setLoadingForm(false);
  };
  const handleCloseChangePassword = () => {
    setShowChangePassowrd(false);
    setLoadingForm(false);
  };
  const handleSaveChangePassword = async (id: string) => {
    try {
      await changePasswordService.update(id, password);
      handleCloseChangePassword();
      toast.success("Đổi mật khẩu thành công");
    } catch (error: any) {
      toast.error("Đổi mật khẩu thất bại");
      setMessagePassword(error.response.data.errors);
    }
  };
  const handleDownloadListStudent = async () => {
    try {
      const response = await studentService.download({
        responseType: "blob", // Chúng ta mong đợi một blob từ API
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      FileSaver.saveAs(blob, "students.xlsx");
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  };
  return (
    <>
      <ModalReact
        handleClose={handleClose}
        handleSave={() => handleSave(student?._id || "")}
        title={
          student?._id === ""
            ? `Thêm học sinh`
            : `Sữa thông tin học sinh ${student.name}`
        }
        labelClose="Đóng"
        labelSave="Lưu"
        size="modal-lg"
        data={
          loadingForm === false ? (
            <StudentAdd
              defaultValue={studentModel}
              nameFCChangeInput={handleChange}
              nameFCChangeSelect={handleSelect}
              message={message}
              status={student._id == "" ? true : false}
            />
          ) : (
            ""
          )
        }
        show={show}
      />
      <ModalReact
        handleClose={handleCloseDelete}
        handleSave={() => handleDelete(student?._id || "")}
        title={`Xóa học sinh ${student.name}`}
        labelClose="Đóng"
        labelSave="Xóa"
        data={
          loadingForm === false
            ? `Bạn có chắc chắc muốn xóa học sinh ${student?.name} này không`
            : ""
        }
        show={showDelete}
      />
      <ModalReact
        handleClose={handleCloseChangePassword}
        handleSave={() => handleSaveChangePassword(student?.user?._id || "")}
        title={`Cập nhập mật khẩu ${student.name}`}
        labelClose="Đóng"
        labelSave="Cập nhập"
        data={
          loadingForm === false && (
            <>
              <Input
                name="newPassword"
                label="Mật khẩu mới"
                onChange={handleChangePassword}
                message={MessagePassword.newPassword}
                type="password"
                value={password.newPassword}
              />
              <Input
                name="comfimPassword"
                label="Nhập lại mật khẩu mới"
                onChange={handleChangePassword}
                message={MessagePassword.comfimPassword}
                type="password"
                value={password.comfimPassword}
              />
            </>
          )
        }
        show={showChangePassowrd}
      />
      <div className="container-fluid mt-3">
        <div className="row g-2">
          <div className="col-3">
            <select
              className="form-select"
              name="grade"
              onChange={handleChangeClassRoom}
              value={filterModel.grade}
            >
              <option value="" hidden>
                Chọn Khối
              </option>
              {listGrade.map((item, index) => (
                <option key={index} value={item}>
                  Khối {item}
                </option>
              ))}
            </select>
          </div>
          <div className="col-3">
            <select
              className="form-select"
              name="classRoom"
              onChange={handleChangeClassRoom}
              value={filterModel.classRoom}
            >
              <option value="" hidden>
                Chọn lớp
              </option>
              {listClassRoom.map((item, index: number) => (
                <option key={index} value={item._id}>
                  Lớp {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {filterModel.classRoom && filterModel.grade ? (
          <>
            <div className="row mt-3">
              <div className="col">
                <p>Danh sách học sinh khối lớp {className}</p>
              </div>
            </div>
            <div className="row g-2">
              <div className="col-auto">
                <button
                  className="btn btn-primary"
                  onClick={handleDownloadListStudent}
                >
                  <i className="fa-solid fa-file-arrow-down"></i> Xuất danh sách
                  lớp
                </button>
              </div>
              <div className="col-auto">
                <button className="btn btn-primary">
                  <i className="fa-solid fa-file-import"></i>
                  Xuất danh sách bài kiểm tra học sinh
                </button>
              </div>

              <div className="col-auto">
                <Link type="button" className="btn btn-light" to="/moveStudent">
                  <i className="fa-solid fa-up-down-left-right"></i>
                  Chuyển nâng lớp cho học sinh
                </Link>
              </div>
              <div className="col text-end">
                <button
                  className="btn btn-success"
                  onClick={() => handleShow("")}
                >
                  <i className="fa-solid fa-plus"></i> Thêm học sinh
                </button>
              </div>
            </div>
            <div className="row mt-4">
              <table className="table table-bordered">
                <thead className="table-success">
                  <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Mã sinh viên</th>
                    <th scope="col">Họ tên</th>
                    <th scope="col">Giới tính</th>
                    <th scope="col">Tên đăng nhập</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {listStudent?.student.map((item, index) => (
                    <tr key={index}>
                      <th scope="row">
                        {(filterModel.page - 1) * 10 + index + 1}
                      </th>
                      <td>{item.codeUser}</td>
                      <td>{item.name}</td>
                      <td>{item.sex == 0 ? "Nam" : "Nữ"}</td>
                      <td>{item.user.username}</td>

                      <td>
                        <button
                          className="btn btn-warning me-2"
                          onClick={() => handleShow(item._id)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          className="btn btn-danger me-2"
                          onClick={() => handleShowDelete(item._id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleShowChangePassword(item._id)}
                        >
                          <i className="fa-solid fa-lock"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <PaginationRect
                totalPage={listStudent?.page.totalPage || 0}
                currentPage={listStudent?.page.currentPage || 0}
                onChangePage={handlePageChange}
              />
            </div>
          </>
        ) : (
          <>
            <div className="row mt-3">
              <div className="col">
                <h3 className="text-center mx-auto">Không có học sinh</h3>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default StudentView;
