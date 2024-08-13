import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import ModalReact from "../../Components/ModalReact";
import PaginationRect from "../../Components/PaginationReact";
import { FilterModel } from "../../models/FilterModel";
import Input from "../../Components/Input";
import changePasswordService, {
  PasswordModel,
} from "../../servers/changePasswordServer";
import FileSaver from "file-saver";
import teacherService, {
  IListTeacher,
  ITeacher,
  ITeacherModel,
} from "../../servers/teacherServer";
import { IChangePassword, IValidationTeacher } from "../../models/Validation";
import TeacherAdd from "./TeacherAdd";
import subjectService, { ISubject } from "../../servers/subjectServer";
import authorizeServices from "../../servers/authorizeServer";
import SelectReact from "../../Components/SelectReact";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
const TeacherView = () => {
  const [listTeacher, setListTeacher] = useState<IListTeacher>();
  const [showAuthorize, setShowAuthorize] = useState(false);
  const [teacherModel, setTeacherModel] = useState<ITeacherModel>({
    name: "",
    codeUser: "",
    address: "",
    cccd: "",
    phone: "",
    dateOfBirth: new Date().toISOString(),
    username: "",
    password: "",
    sex: 0,
    email: "",
    subjectId: [],
  });
  const [listSubject, setListSubject] = useState<ISubject[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [teacher, setTeacher] = useState<Partial<ITeacher>>({ _id: "" });
  const [message, setMessage] = useState<IValidationTeacher>({
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
  const [filterModel, setFilterModel] = useState({
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 10,
    sortBy: "",
    order: "asc",
    search: searchParams.get("search") || "",
    subjectId: searchParams.get("subjectId") || "",
  });
  const loadData = async (
    search?: string,
    subjectId?: string,
    page?: number,
    pageSize?: number,
    sortBy?: string,
    order?: string
  ) => {
    try {
      await teacherService
        .list(search, subjectId, page, pageSize, sortBy, order)
        .then((res) => setListTeacher(res.data));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filterModel.subjectId) {
      params["subjectId"] = String(filterModel.subjectId);
    }
    if (filterModel.page) {
      params["page"] = String(filterModel.page);
    }
    if (filterModel.search) {
      params["search"] = String(filterModel.search);
    }
    document.title = "Quản lí giáo viên";
    setSearchParams(params);
    loadData(
      "",
      filterModel.subjectId,
      filterModel.page,
      filterModel.pageSize,
      filterModel.sortBy,
      filterModel.order
    );
  }, [
    filterModel.order,
    filterModel.page,
    filterModel.page,
    filterModel.pageSize,
    filterModel.subjectId,
  ]);
  useEffect(() => {
    try {
      subjectService.list().then((res) => setListSubject(res.data.subject));
    } catch (error: any) {
      console.log(error);
    }
  }, []);
  const handleShow = async (id: string) => {
    setTeacher({
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
      setTeacherModel({
        name: "",
        codeUser: "",
        address: "",
        cccd: "",
        phone: "",
        dateOfBirth: new Date().toISOString().split("T")[0],
        subjectId: [],
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
        const response = await teacherService.add(teacherModel); // Gọi service để thêm country
        handleClose(); // Đóng modal
        loadData(
          "",
          filterModel.subjectId,
          filterModel.page,
          filterModel.pageSize,
          filterModel.sortBy,
          filterModel.order
        ); // Tải dữ liệu mới
        toast.success("Tạo giáo viên thành công");
      } catch (error: any) {
        toast.error("Tạo giáo viên thất bại");
        setMessage(error.response.data.errors);
      }
    } else {
      try {
        const response = await teacherService.update(id, teacherModel);
        handleClose(); // Đóng modal
        loadData(
          "",
          filterModel.subjectId,
          filterModel.page,
          filterModel.pageSize,
          filterModel.sortBy,
          filterModel.order
        ); // Tải dữ liệu mới
        toast.success("Cập nhập giáo viên thành công");
      } catch (error: any) {
        toast.error("Cập nhập giáo viên thất bại");
        setMessage(error.response.data.errors);
      }
    }
  };
  const handleGet = async (id: string) => {
    try {
      var repository = await teacherService.get(id);
      setTeacher(repository.data);
      setTeacherModel({
        name: repository.data.name,
        codeUser: repository.data.codeUser,
        subjectId: repository.data.subject.map((item) => item._id),
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
    setTeacherModel({
      ...teacherModel,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  const handleSelect = (e: string | string[], name: string) => {
    setTeacherModel({ ...teacherModel, [name]: e });
  };
  const handleDelete = async (id: string) => {
    try {
      await teacherService.remove(id);
      handleCloseDelete();
      loadData(
        "",
        filterModel.subjectId,
        filterModel.page,
        filterModel.pageSize,
        filterModel.sortBy,
        filterModel.order
      ); // Tải dữ liệu mới
      toast.success("Xóa giáo viên thành công");
    } catch (error: any) {
      toast.error("Xóa giáo viên thất bại");
      console.log(error);
    }
  };
  const handlePageChange = (page: number) => {
    setFilterModel({ ...filterModel, page: page });
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
    } catch (error: any) {
      setMessagePassword(error.response.data.errors);
    }
  };
  const handleDownloadListStudent = async () => {
    try {
      const response = await teacherService.download({
        responseType: "blob", // Chúng ta mong đợi một blob từ API
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      FileSaver.saveAs(blob, "teacher.xlsx");
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  };
  const handleAuthorize = async (userId: string) => {
    if (userId) {
      try {
        await authorizeServices.put(userId);
        handleCloseAuthorize();
        toast.success("Trao quyền thành công");
      } catch (error: any) {
        toast.error("Trao quyền thất bại");
        console.log(error);
      }
    }
  };
  const handleShowAuthorize = async (userId: string) => {
    await handleGet(userId);
    setShowAuthorize(true);
    setLoadingForm(false);
  };
  const handleCloseAuthorize = () => {
    setShowAuthorize(false);
    setLoadingForm(true);
  };

  const handleSelectFilter = (e: string | string[], name: string) => {
    setFilterModel({ ...filterModel, [name]: e });
  };
  const handleFilter = (e: React.FormEvent<HTMLInputElement>) => {
    setFilterModel({
      ...filterModel,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  const handleSearch = () => {
    loadData(
      filterModel.search,
      filterModel.subjectId,
      filterModel.page,
      filterModel.pageSize,
      filterModel.sortBy,
      filterModel.order
    );
  };
  console.log(filterModel);
  return (
    <>
      <ModalReact
        handleClose={handleClose}
        handleSave={() => handleSave(teacher?._id || "")}
        title={
          teacher?._id === ""
            ? `Thêm giáo viên`
            : `Sữa thông tin giáo viên ${teacher.name}`
        }
        labelClose="Đóng"
        labelSave="Lưu"
        size="modal-lg"
        data={
          loadingForm === false ? (
            <TeacherAdd
              defaultValue={teacherModel}
              nameFCChangeInput={handleChange}
              nameFCChangeSelect={handleSelect}
              message={message}
              listSubject={listSubject}
              status={teacher._id == "" ? true : false}
            />
          ) : (
            ""
          )
        }
        show={show}
      />
      <ModalReact
        handleClose={handleCloseDelete}
        handleSave={() => handleDelete(teacher?._id || "")}
        title={`Xóa giáo viên ${teacher?.name}`}
        labelClose="Đóng"
        labelSave="Xóa"
        data={
          loadingForm === false
            ? `Bạn có chắc chắc muốn xóa giáo viên ${teacher?.name} này không`
            : ""
        }
        show={showDelete}
      />
      <ModalReact
        handleClose={handleCloseAuthorize}
        handleSave={() => handleAuthorize(teacher.user?._id || "")}
        title={`Trao quyền admin giáo viên ${teacher.name}`}
        labelClose="Đóng"
        labelSave="Trao quyền"
        data={
          loadingForm === false
            ? `Bạn có chắc muốn trao quyền admin cho giáo viên ${teacher.name} không`
            : ""
        }
        show={showAuthorize}
      />
      <ModalReact
        handleClose={handleCloseChangePassword}
        handleSave={() => handleSaveChangePassword(teacher?.user?._id || "")}
        title={`Cập nhập mật khẩu`}
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
        <>
          <div className="row mt-3">
            <div className="col">
              <p className="fs-4 fw-bold">
                Danh sách giáo viên - sỉ số: {listTeacher?.page.totalDocument}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-auto">
              <button
                className="btn btn-primary"
                onClick={handleDownloadListStudent}
              >
                <i className="fa-solid fa-file-arrow-down"></i> Xuất danh sách
                toàn bộ giáo viên
              </button>
            </div>
            <div className="col">
              <div className="input-group mb-3">
                <input
                  type="search"
                  className="form-control"
                  name="search"
                  onChange={handleFilter}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handleSearch}
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </div>
            <div className="col">
              <SelectReact
                isMul={false}
                option={listSubject.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
                defaultValue={[
                  {
                    label:
                      listSubject.find(
                        (item) => item._id === filterModel.subjectId
                      )?.name ?? "",
                    value: filterModel.subjectId,
                  },
                ]}
                name="subjectId"
                nameHandle={handleSelectFilter}
              />
            </div>
            <div className="col text-end">
              <button
                className="btn btn-success"
                onClick={() => handleShow("")}
              >
                <i className="fa-solid fa-plus"></i> Thêm giáo viên
              </button>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12">
              <table className="table table-bordered">
                <thead className="table-success">
                  <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Mã giáo viên</th>
                    <th scope="col">Họ tên</th>
                    <th scope="col">Giới tính</th>
                    <th scope="col">Môn học</th>
                    <th scope="col">Tên đăng nhập</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {listTeacher?.teacher.map((item, index) => (
                    <tr key={index}>
                      <th scope="row">
                        {(filterModel.page - 1) * filterModel.pageSize +
                          index +
                          1}
                      </th>
                      <td>{item.codeUser}</td>
                      <td>{item.name}</td>
                      <td>{item.sex == 0 ? "Nam" : "Nữ"}</td>
                      <td>
                        {item.subject.map((subject) => subject.name).join(", ")}
                      </td>
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
                          className="btn btn-primary me-2"
                          onClick={() => handleShowChangePassword(item._id)}
                        >
                          <i className="fa-solid fa-lock"></i>
                        </button>
                        <button
                          className="btn btn-info"
                          onClick={() => handleShowAuthorize(item._id)}
                        >
                          <i className="fa-solid fa-user-tie"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-12">
              <PaginationRect
                totalPage={listTeacher?.page.totalPage || 0}
                currentPage={listTeacher?.page.currentPage || 0}
                onChangePage={handlePageChange}
              />
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default TeacherView;
