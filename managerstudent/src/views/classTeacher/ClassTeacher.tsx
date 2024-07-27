import * as React from "react";
import { useState, useEffect } from "react";
import classService, { IClassRoom } from "../../servers/classServer";
import { IValidationTeacherClassRoom } from "../../models/Validation";
import ModalReact from "../../Components/ModalReact";
import PaginationRect from "../../Components/PaginationReact";
import { FilterStudentModel } from "../../models/FilterModel";
import teacherClassRoomService, {
  IListTeacherRoom,
  ITeacherClassRoomModel,
  ITeacherRoom,
} from "../../servers/teacherClassRoomServer";
import ClassTeacherAdd from "./ClassTeacherAdd";
import teacherService, { ITeacher } from "../../servers/teacherServer";
import { useSearchParams } from "react-router-dom";
import subjectDetailService, {
  ISubjectDetail,
} from "../../servers/subjectDetailServer";
import SystemService, { ISystem } from "../../servers/systemServer";
import { toast } from "react-toastify";
const ClassTeacher = () => {
  const [listSubjectDetail, setListSubjectDetail] = useState<ISubjectDetail[]>(
    []
  );
  const [listTeacher, setListTeacher] = useState<ITeacher[]>([]);

  const [listTeacherClassRoom, setListTeacherClassRoom] =
    useState<IListTeacherRoom>();
  const listGrade = ["10", "11", "12"];
  const [className, setclassName] = useState<string>();
  const [teacherClassRoomModel, setTeacherClassRoomModel] =
    useState<ITeacherClassRoomModel>({
      teacherId: "",
      classRoomId: "",
      subjectDetailId: "",
    });
  const [listClassRoom, setListClassRoom] = useState<IClassRoom[]>([]);
  const [teacherClassRoom, setTeacherClassRoom] = useState<
    Partial<ITeacherRoom>
  >({ _id: "" });
  const [message, setMessage] = useState<IValidationTeacherClassRoom>({
    teacherId: "",
    classRoomId: "",
    subjectId: "",
  });
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [loadingForm, setLoadingForm] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterModel, setFilterModel] = useState<FilterStudentModel>({
    page: 1,
    pageSize: 10,
    sortBy: "",
    order: "asc",
    grade: searchParams.get("grade") ?? "",
    classRoom: searchParams.get("classRoom") ?? "",
  });
  const [system, setSystem] = useState<Partial<ISystem>>({ _id: "" });
  const loadData = async (
    search?: string,
    page?: number,
    pageSize?: number,
    sortBy?: string,
    order?: string,
    classRoom?: string
  ) => {
    try {
      await teacherClassRoomService
        .list(search, page, pageSize, sortBy, order, classRoom)
        .then((res) => setListTeacherClassRoom(res.data));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (filterModel.classRoom) {
      loadData(
        "",
        filterModel.page,
        filterModel.pageSize,
        filterModel.sortBy,
        filterModel.order,
        filterModel.classRoom
      );
      let objectClassName = listClassRoom.find(
        (item) => item._id == filterModel.classRoom
      );
      setclassName(objectClassName?.name);
    }
  }, [
    filterModel.classRoom,
    filterModel.page,
    filterModel.pageSize,
    filterModel.order,
    filterModel.sortBy,
  ]);
  useEffect(() => {
    if (filterModel.grade) {
      classService
        .list(filterModel.grade)
        .then((res) => setListClassRoom(res.data));
    }
  }, [filterModel.grade]);
  useEffect(() => {
    try {
      subjectDetailService
        .list(undefined, filterModel.grade)
        .then((res) => setListSubjectDetail(res.data));
      SystemService.get().then((res) => setSystem(res.data));
      teacherService.list().then((res) => setListTeacher(res.data.teacher));
    } catch (error: any) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filterModel.grade) {
      params["grade"] = String(filterModel.grade);
    }
    if (filterModel.classRoom) {
      params["classRoom"] = String(filterModel.classRoom);
    }
    setSearchParams(params);
  }, [filterModel.classRoom, filterModel.grade]);
  const handleShow = async (id: string) => {
    setTeacherClassRoom({
      _id: "",
    });
    setMessage({
      subjectId: "",
      teacherId: "",
      classRoomId: "",
    });
    if (id !== "") {
      await handleGet(id);
    } else {
      setTeacherClassRoomModel({
        subjectDetailId: "",
        teacherId: "",
        classRoomId: filterModel.classRoom,
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
        const response = await teacherClassRoomService.add(
          teacherClassRoomModel
        ); // Gọi service để thêm country
        handleClose(); // Đóng modal
        loadData(
          "",
          filterModel.page,
          filterModel.pageSize,
          filterModel.sortBy,
          filterModel.order,
          filterModel.classRoom
        ); // Tải dữ liệu mới
        toast.success("Tạo lớp học thành công");
      } catch (error: any) {
        setMessage(error.response.data.errors);
        toast.error("Tạo lớp học thất bại");
      }
    } else {
      try {
        const response = await teacherClassRoomService.update(
          id,
          teacherClassRoomModel
        );
        handleClose(); // Đóng modal
        loadData(
          "",
          filterModel.page,
          filterModel.pageSize,
          filterModel.sortBy,
          filterModel.order,
          filterModel.classRoom
        ); // Tải dữ liệu mới
        toast.success("Cập nhập môn học cho học sinh thành công");
      } catch (error: any) {
        toast.error("Cập nhập lớp học thất bại cho học sinh");
        setMessage(error.response.data.errors);
      }
    }
  };
  const handleGet = async (id: string) => {
    try {
      var repository = await teacherClassRoomService.get(id);
      setTeacherClassRoom(repository.data);
      setTeacherClassRoomModel({
        subjectDetailId: repository.data.subjectDetail._id,
        classRoomId: repository.data.classRoom._id,
        teacherId: repository.data.teacher._id,
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
    setTeacherClassRoomModel({
      ...teacherClassRoomModel,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  const handleSelect = (e: string | string[], name: string) => {
    let updatedModel = { ...teacherClassRoomModel, [name]: e };
    if (name === "subjectId") {
      updatedModel.teacherId = "";
    }
    setTeacherClassRoomModel(updatedModel);
  };
  const handleDelete = async (id: string) => {
    try {
      await teacherClassRoomService.remove(id);
      handleCloseDelete();
      loadData(
        "",
        filterModel.page,
        filterModel.pageSize,
        filterModel.sortBy,
        filterModel.order,
        filterModel.classRoom
      ); // Tải dữ liệu mới
    } catch (error: any) {
      console.log(error);
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
  return (
    <>
      <ModalReact
        handleClose={handleClose}
        handleSave={() => handleSave(teacherClassRoom?._id || "")}
        title={
          teacherClassRoom?._id === ""
            ? `Thêm môn học cho lớp `
            : `Cập nhập môn học cho lớp`
        }
        labelClose="Đóng"
        labelSave="Lưu"
        size="modal-lg"
        height="70%"
        data={
          loadingForm === false ? (
            <ClassTeacherAdd
              defaultValue={teacherClassRoomModel}
              listSubject={listSubjectDetail}
              listTeacher={listTeacher}
              message={message}
              nameFCChangeSelect={handleSelect}
            />
          ) : (
            ""
          )
        }
        show={show}
      />
      <ModalReact
        handleClose={handleCloseDelete}
        handleSave={() => handleDelete(teacherClassRoom?._id || "")}
        title={`Xóa môn học ra khỏa lớp`}
        labelClose="Đóng"
        labelSave="Xóa"
        data={
          loadingForm === false
            ? `Bạn có chắc chắc muốn xóa môn ${teacherClassRoom?.subjectDetail?.subject.name} ra khỏi lớp ${teacherClassRoom?.classRoom?.name} không`
            : ""
        }
        show={showDelete}
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
              {listClassRoom.map((item, index) => (
                <option key={index} value={item._id}>
                  Lớp {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {filterModel.classRoom && filterModel.grade ? (
          <>
            <div className="row mt-3 align-items-center">
              <div className="col">
                <p className="fw-bold fs-5 mb-0">
                  Danh sách Môn học lớp {className}
                </p>
                <p>
                  Niên khóa: {system.schoolYear} && {system.semester}
                </p>
              </div>
              <div className="col text-end">
                <button
                  className="btn btn-success"
                  onClick={() => handleShow("")}
                >
                  <i className="fa-solid fa-plus"></i> Thêm môn học
                </button>
              </div>
            </div>

            {(listTeacherClassRoom?.teacherClassRoom.length as number) > 0 ? (
              <div className="row mt-4">
                <div className="col-12">
                  <table className="table table-bordered">
                    <thead className="table-success">
                      <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Môn học</th>
                        <th scope="col">Giáo viên</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {listTeacherClassRoom?.teacherClassRoom.map(
                        (item, index) => (
                          <tr key={index}>
                            <th scope="row">
                              {(filterModel.page - 1) * filterModel.pageSize +
                                index +
                                1}
                            </th>
                            <td>{item.subjectDetail.subject.name}</td>
                            <td>{item.teacher.name}</td>
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
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
                <PaginationRect
                  totalPage={listTeacherClassRoom?.page.totalPage || 0}
                  currentPage={listTeacherClassRoom?.page.currentPage || 0}
                  onChangePage={handlePageChange}
                />
              </div>
            ) : (
              <>
                <div className="row mt-3">
                  <div className="col">
                    <h3 className="text-center mx-auto">
                      Lớp {className} chưa có bất kì môn học nào hết
                    </h3>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="row mt-3">
              <div className="col">
                <h3 className="text-center mx-auto">Vui lòng chọn lớp</h3>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ClassTeacher;
