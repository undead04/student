import * as React from "react";
import { useState, useEffect } from "react";
import subjectService, { ISubject } from "../../servers/subjectServer";
import { FilterQuestionModel } from "../../models/FilterModel";
import questionService, {
  IListQuestion,
  IQuestion,
} from "../../servers/questionServer";
import subjectDetailService from "../../servers/subjectDetailServer";
import LoadingReact from "../../Components/LoadingReact";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaginationRect from "../../Components/PaginationReact";
import ModalReact from "../../Components/ModalReact";
import QuesionAdd from "./QuestionAdd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import teacherClassRoomService from "../../servers/teacherClassRoomServer";
const QuestionView = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const role = userInfo?.user.role;
  const [searchParams, setSearchParams] = useSearchParams();
  const [listQuestion, setListQuestion] = useState<IListQuestion>();
  const [loading, setLoading] = useState(true);
  const [listSubject, setListSubject] = useState<ISubject[]>([]);
  const [question, setQuestion] = useState<Partial<IQuestion>>({
    _id: "",
    answer: [],
  });
  const [listGrade, setListGrade] = useState<string[]>([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const listLevel = ["Thấp", "Trung bình", "Cao"];
  const [tableOfContents, setTableOfContents] = useState<string[]>([]);
  const [show, setshow] = useState(false);
  const [showSeen, setShowSeen] = useState(false);
  const handleShowSeen = async (id: string) => {
    await handleGet(id);
    setShowSeen(true);
  };
  const handleCloseSeen = async () => {
    setShowSeen(false);
  };
  const handleGet = async (id: string) => {
    try {
      await questionService.get(id).then((res) => setQuestion(res.data));
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
      await questionService.remove(id);
      handleClose();
      loadData(
        "",
        filterModel.subjectId,
        filterModel.grade,
        filterModel.level.toString(),
        filterModel.tableOfContents
      );
      toast.success("Xóa câu hỏi thành công");
    } catch (error: any) {
      toast.error("Xóa câu hỏi thất bại");
      console.log(error);
    }
  };
  const [filterModel, setFilterModel] = useState<FilterQuestionModel>({
    page: searchParams.get("page") ?? "1",
    pageSize: 10,
    order: "",
    sortBy: "",
    level: searchParams.get("level") ?? "",
    search: "",
    subjectId: searchParams.get("subjectId") ?? "",
    grade: searchParams.get("grade") ?? "",
    tableOfContents: searchParams.get("tableOfContents") ?? "",
  });

  const loadData = async (
    search?: string,
    subjectId?: string,
    grade?: string,
    level?: string,
    tableOfContents?: string,
    page?: string
  ) => {
    try {
      if (role?.includes("admin")) {
        await questionService
          .list(
            search,
            subjectId,
            grade,
            level,
            tableOfContents,
            undefined,
            undefined,
            page
          )
          .then((res) => {
            setListQuestion(res.data);
            setLoadingTable(false);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        await questionService
          .getTeacher(search, subjectId, grade, level, tableOfContents, page)
          .then((res) => {
            setListQuestion(res.data);
            setLoadingTable(false); // Tắt trạng thái loading khi nhận được phản hồi thành công
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (filterModel.subjectId && filterModel.grade) {
      try {
        subjectDetailService
          .list(filterModel.subjectId, filterModel.grade)
          .then((res) =>
            setTableOfContents(res.data.flatMap((item) => item.tableOfContents))
          );
      } catch (error: any) {
        console.log(error);
      }
    } else {
      setTableOfContents([]);
    }
  }, [filterModel.subjectId, filterModel.grade]);
  useEffect(() => {
    if (role?.includes("admin")) {
      subjectService.list().then((res) => setListSubject(res.data.subject));
      setLoading(false);
    } else {
      teacherClassRoomService.getStudent().then((res) => {
        const uniqueSubjectMap: Map<string, ISubject> = new Map();
        res.data.teacherClassRoom
          .flatMap((item) => item.subjectDetail.subject)
          .forEach((subject) => {
            uniqueSubjectMap.set(subject._id, subject); // Sử dụng id làm khóa để loại bỏ trùng lặp
          });
        const uniqueSubject: ISubject[] = Array.from(uniqueSubjectMap.values());
        setListSubject(uniqueSubject);
        setLoading(false);
      });
    }
  }, []);
  useEffect(() => {
    if (filterModel.subjectId) {
      teacherClassRoomService
        .getStudent(undefined, filterModel.subjectId)
        .then((res) => {
          const uniqueGradeMap: Map<string, string> = new Map();
          res.data.teacherClassRoom
            .flatMap((item) => item.subjectDetail.grade)
            .forEach((grade) => {
              uniqueGradeMap.set(grade.toString(), grade.toString()); // Sử dụng id làm khóa để loại bỏ trùng lặp
            });
          const uniqueGrade: string[] = Array.from(uniqueGradeMap.values());
          setListGrade(uniqueGrade);
        });
    }
  }, [filterModel.subjectId]);
  useEffect(() => {
    document.title = "Tạo bài tập về nhà";
    const params: Record<string, string> = {};
    if (filterModel.subjectId) {
      params["subjectId"] = String(filterModel.subjectId);
    }
    if (filterModel.grade) {
      params["grade"] = String(filterModel.grade);
    }
    if (filterModel.level) {
      params["level"] = String(filterModel.level);
    }
    if (filterModel.tableOfContents) {
      params["tableOfContents"] = String(filterModel.tableOfContents);
    }
    if (filterModel.page) {
      params["page"] = String(filterModel.page);
    }
    setSearchParams(params);
    document.title = "Ngân hàng câu hỏi";
    loadData(
      "",
      filterModel.subjectId,
      filterModel.grade,
      filterModel.level.toString(),
      filterModel.tableOfContents,
      filterModel.page
    );
  }, [filterModel]);
  const handleSelectFilter = (e: React.FormEvent<HTMLSelectElement>) => {
    let updatedFilterModel = {
      ...filterModel,
      [e.currentTarget.name]: e.currentTarget.value,
    };
    if (e.currentTarget.name === "subjectId") {
      updatedFilterModel.grade = "";
      updatedFilterModel.tableOfContents = "";
    } else if (e.currentTarget.name === "grade") {
      updatedFilterModel.tableOfContents = "";
    }
    setFilterModel(updatedFilterModel);
  };
  const handlePageChange = (page: string) => {
    setFilterModel({ ...filterModel, page: page });
  };
  const handleNavigateCreate = (id: string) => {
    if (id === "") {
      navigate("/question/create");
    } else {
      navigate(`/question/edit/${id}`);
    }
  };
  console.log(filterModel.grade);
  return (
    <>
      <ModalReact
        handleClose={handleClose}
        handleSave={() => handleDelete(question?._id || "")}
        title={`Xóa câu hỏi`}
        labelClose="Đóng"
        labelSave="Xóa"
        data={`Bạn có chắc muốn xóa câu hỏi này không`}
        show={show}
      />
      <ModalReact
        handleClose={handleCloseSeen}
        isDisabledButton={true}
        title={`Xem câu hỏi`}
        labelClose="Đóng"
        data={<QuesionAdd question={question ?? ({ _id: "" } as IQuestion)} />}
        show={showSeen}
      />
      {loading === false ? (
        <>
          <div className="container mt-3">
            <div className="row">
              <div className="col-12 col-sm-4 col-lg-3">
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Môn học
                  </label>
                  <select
                    className="form-select"
                    name="subjectId"
                    value={filterModel.subjectId}
                    onChange={handleSelectFilter}
                  >
                    <option value="" disabled hidden>
                      Chon môn học
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
                    Chọn khối
                  </label>
                  <select
                    className="form-select"
                    name="grade"
                    value={filterModel.grade}
                    onChange={handleSelectFilter}
                  >
                    <option value="" disabled hidden>
                      Chọn khối
                    </option>
                    {listGrade.map((item, index) => (
                      <option value={item} key={index}>
                        Lớp {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-12 col-sm-4 col-lg-3">
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Mức độ
                  </label>
                  <select
                    className="form-select"
                    name="level"
                    value={filterModel.level}
                    onChange={handleSelectFilter}
                  >
                    <option value="" disabled hidden>
                      Chọn cấp độ
                    </option>
                    {listLevel.map((item, index) => (
                      <option value={index.toString()} key={index}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-12 col-sm-4 col-lg-3">
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Chủ đề
                  </label>
                  <select
                    className="form-select"
                    name="tableOfContents"
                    value={filterModel.tableOfContents}
                    onChange={handleSelectFilter}
                  >
                    <option value="" disabled hidden>
                      Chọn chủ đề
                    </option>
                    {tableOfContents.map((item, index) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row mt-3">
              <div className="col-12 text-end">
                <button
                  className="btn btn-success"
                  onClick={() => handleNavigateCreate("")}
                >
                  Thêm mới
                </button>
              </div>
            </div>
            {loadingTable === false ? (
              listQuestion && listQuestion.question.length > 0 ? (
                <>
                  <div className="row mt-3">
                    <div className="col-12">
                      <table className="table table-bordered">
                        <thead className="table-success">
                          <tr className="text-center fw-bolder">
                            <th className="align-middle" scope="col">
                              STT
                            </th>
                            <th className="align-middle" scope="col">
                              Môn học
                            </th>
                            <th className="align-middle" scope="col">
                              Mức độ
                            </th>
                            <th className="align-middle" scope="col">
                              Người tạo
                            </th>
                            <th className="align-middle" scope="col">
                              Loại câu hỏi
                            </th>
                            <th className="align-middle" scope="col">
                              Cập nhập lần cuối
                            </th>
                            <th className="align-middle"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {listQuestion?.question.map((item, index) => (
                            <tr key={index} className="text-center">
                              <th className=" ">
                                {(Number(filterModel.page) - 1) *
                                  filterModel.pageSize +
                                  index +
                                  1}
                              </th>
                              <td className="align-middle">
                                {item.subjectDetail.subject.name}
                              </td>
                              <td className="align-middle">
                                {item.level === 0
                                  ? "Thấp"
                                  : item.level === 1
                                  ? "Trùng bình"
                                  : "Cao"}
                              </td>
                              <td className="align-middle">
                                {item.teacher.name}
                              </td>
                              <td className="align-middle">
                                {item.create_at.toString().split("T")[0]}
                              </td>
                              <td className="align-middle">
                                {item.isMul
                                  ? "Trắc nghiệm có nhiều đáp án"
                                  : "Trắc nghiệm có  1 đáp án"}
                              </td>
                              <td className="text-start">
                                <button
                                  className="btn btn-info me-2"
                                  onClick={() => handleShowSeen(item._id)}
                                >
                                  <i className="fa-solid fa-eye"></i>
                                </button>
                                <button
                                  className="btn btn-warning me-2"
                                  onClick={() => handleNavigateCreate(item._id)}
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
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
                    </div>
                    <div className="col-12">
                      <PaginationRect
                        onChangePage={handlePageChange}
                        totalPage={listQuestion?.page.totalPage ?? 0}
                        currentPage={listQuestion?.page.currentPage ?? 0}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="row w-100 mt-5">
                    <div className="col text-center">
                      <h1>Không có câu hỏi nào</h1>
                    </div>
                  </div>
                </>
              )
            ) : (
              <LoadingReact />
            )}
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

export default QuestionView;
