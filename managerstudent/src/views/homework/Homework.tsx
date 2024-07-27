import * as React from "react";
import { useState, useEffect } from "react";
import subjectService, { ISubject } from "../../servers/subjectServer";
import LoadingReact from "../../Components/LoadingReact";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaginationRect from "../../Components/PaginationReact";
import ModalReact from "../../Components/ModalReact";
import homeworkService, {
  IHomework,
  IListHomework,
} from "../../servers/homeworkServer";
import classService, { IClassRoom } from "../../servers/classServer";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
const Homework = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [listHomework, setListHomework] = useState<IListHomework>({
    homework: [],
    page: {
      totalPage: 0,
      currentPage: 0,
    },
  });
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const role = userInfo?.user.role;
  const [loading, setLoading] = useState(true);
  const [listSubject, setListSubject] = useState<ISubject[]>([]);
  const [homework, setHomework] = useState<Partial<IHomework>>({
    _id: "",
  });
  const [listClassRoom, setListClassRoom] = useState<IClassRoom[]>([]);
  const listGrade = ["10", "11", "12"];
  const [show, setshow] = useState(false);
  const [filterModel, setFilterModel] = useState({
    page:
      Number(searchParams.get("page")) === 0
        ? 1
        : Number(searchParams.get("page")),
    pageSize: 10,
    subjectId: searchParams.get("subjectId") ?? "",
    classRoomId: searchParams.get("classRoomId") ?? "",
    from: undefined,
    to: undefined,
    grade: searchParams.get("grade") ?? "",
  });
  const loadData = async (
    subjectId?: string,
    classRoomId?: string,
    from?: Date,
    to?: Date,
    page?: number,
    pageSize?: number
  ) => {
    try {
      if (!role?.includes("teacher")) {
        homeworkService
          .list(subjectId, classRoomId, from, to, page, pageSize)
          .then((res) => setListHomework(res.data));
      } else {
        homeworkService
          .getTeacher(subjectId, classRoomId, from, to, page, pageSize)
          .then((res) => setListHomework(res.data));
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    subjectService.list().then((res) => setListSubject(res.data.subject));
  }, []);
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filterModel.subjectId) {
      params["subjectId"] = String(filterModel.subjectId);
    }
    if (filterModel.grade) {
      params["grade"] = String(filterModel.grade);
    }
    if (filterModel.classRoomId) {
      params["classRoomId"] = String(filterModel.classRoomId);
    }
    if (filterModel.page) {
      params["page"] = String(filterModel.page);
    }
    setSearchParams(params);
    loadData(
      filterModel.subjectId,
      filterModel.classRoomId,
      filterModel.from,
      filterModel.to,
      filterModel.page,
      filterModel.pageSize
    );
    setLoading(false);
  }, [filterModel]);
  useEffect(() => {
    try {
      if (filterModel.grade) {
        classService
          .list(filterModel.grade)
          .then((res) => setListClassRoom(res.data));
      }
    } catch (error: any) {
      console.log(error);
    }
  }, [filterModel.grade]);
  const handleSelectFilter = (e: React.FormEvent<HTMLSelectElement>) => {
    setFilterModel({
      ...filterModel,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  const handleGet = async (id: string) => {
    try {
      await homeworkService.get(id).then((res) => setHomework(res.data));
    } catch (error: any) {
      console.log(error);
    }
  };
  const handleShow = async (id: string) => {
    await handleGet(id);
    setshow(true);
  };
  const handleClose = () => {
    setshow(false);
  };
  const handleDelete = async (id: string) => {
    try {
      await homeworkService.remove(id);
      handleClose();
      loadData(
        filterModel.subjectId,
        filterModel.classRoomId,
        filterModel.from,
        filterModel.to,
        filterModel.page,
        filterModel.pageSize
      );
    } catch (error: any) {
      console.log(error);
    }
  };
  const handlePageChange = (page: number) => {
    setFilterModel({ ...filterModel, page: page });
  };
  const handleNavigateCreate = (id: string) => {
    if (id) {
      navigate(`/homework/${id}`);
    } else {
      navigate("/homework/create");
    }
  };
  const handleNavigateStatical = (id: string) => {
    navigate(`/statisticalHomework/${id}`);
  };
  return (
    <>
      <ModalReact
        handleClose={handleClose}
        handleSave={() => handleDelete(homework?._id || "")}
        title={`Xóa bài tập về nhà ${homework.name}`}
        labelClose="Đóng"
        labelSave="Xóa"
        data={`Bạn có chắc muốn xóa bài tập ${homework.name} này không`}
        show={show}
      />
      {loading === false ? (
        <>
          <div className="container mt-3">
            <div className="row">
              <div className="col-12">
                <p className="fs-4 fw-bolder">Danh sách bài tập về nhà</p>
              </div>
              <div className="col-12 col-sm-4 col-lg-3">
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Môn học
                  </label>
                  <select
                    className="form-select"
                    name="subjectId"
                    defaultValue={""}
                    onChange={handleSelectFilter}
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
              <div className="col-12 col-sm-4 col-lg-3">
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Khối
                  </label>
                  <select
                    className="form-select"
                    name="grade"
                    defaultValue={""}
                    onChange={handleSelectFilter}
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
              <div className="col-12 col-sm-4 col-lg-3">
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Lớp
                  </label>
                  <select
                    className="form-select"
                    name="classRoomId"
                    defaultValue={""}
                    onChange={handleSelectFilter}
                  >
                    <option value="" disabled hidden>
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
              <div className="col-12 col-sm-4 col-lg-3">
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    className="form-control bg-transparent text-primary"
                    name="startDate"
                  />
                </div>
              </div>
              <div className="col-12 col-sm-4 col-lg-3">
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    className="form-control bg-transparent text-primary"
                    name="endDate"
                  />
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-12 text-end">
                <button
                  className="btn btn-success"
                  onClick={() => handleNavigateCreate("")}
                >
                  Tạo bài tập về nhà
                </button>
              </div>
            </div>
            <div className="row mt-3">
              <table className="table table-bordered">
                <thead className="table-success">
                  <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Môn</th>
                    <th scope="col">Lớp</th>
                    <th scope="col">Tên bài tập</th>
                    <th scope="col">Người tạo</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {listHomework?.homework.map((item, index) => (
                    <tr key={index}>
                      <th scope="row">
                        {(filterModel.page - 1) * filterModel.pageSize +
                          index +
                          1}
                      </th>
                      <td>{item.subjectDetail.subject.name}</td>
                      <td>{item.classRoom.map((item) => `${item.name},  `)}</td>
                      <td>{item.name}</td>
                      <td>{item.create_at.toString().split("T")[0]}</td>

                      <td>
                        <button
                          className="btn btn-info me-2"
                          onClick={() => handleNavigateCreate(item._id)}
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button
                          className="btn btn-info me-2"
                          onClick={() => handleNavigateStatical(item._id)}
                        >
                          Thống kê
                        </button>
                        <button
                          className="btn btn-danger me-2"
                          onClick={() => handleShow(item._id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <PaginationRect
                onChangePage={handlePageChange}
                totalPage={listHomework?.page.totalPage ?? 0}
                currentPage={listHomework?.page.currentPage ?? 0}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <LoadingReact />
        </>
      )}
    </>
  );
};

export default Homework;
