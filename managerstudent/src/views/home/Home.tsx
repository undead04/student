import * as React from "react";
import { useState, useEffect } from "react";
import teacherClassRoomService, {
  ITeacherRoom,
} from "../../servers/teacherClassRoomServer";
import { Link, useNavigate } from "react-router-dom";
import SystemService, { ISystem } from "../../servers/systemServer";
import myHomeworkService, {
  IListMyHomework,
} from "../../servers/myHomeworkServer";
import myExamService, { IListMyExam } from "../../servers/myExamServer";
import PaginationRect from "../../Components/PaginationReact";
import LoadingReact from "../../Components/LoadingReact";
const Home = () => {
  const [listSubject, setListSubject] = useState<ITeacherRoom[]>([]);
  const [system, setSystem] = useState<Partial<ISystem>>();
  const [listHomework, setListHomework] = useState<Partial<IListMyHomework>>();
  const [listExam, setListExam] = useState<Partial<IListMyExam>>();
  const [pageHomework, setPageHomework] = useState<number>(1);
  const [pageExam, setPageExam] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const loadData = async (page?: number) => {
    try {
      const [studentRes, systemRes, homeworkRes, examRes] =
        await Promise.allSettled([
          teacherClassRoomService.getStudent().then((res) => res.data),
          SystemService.get().then((res) => res.data),
          myHomeworkService
            .getListStudent(undefined, false, page, 4)
            .then((res) => res.data),
          myExamService
            .getListStudent(undefined, false, page)
            .then((res) => res.data),
        ]);

      if (studentRes.status === "fulfilled")
        setListSubject(studentRes.value.teacherClassRoom);
      if (systemRes.status === "fulfilled") setSystem(systemRes.value);
      if (homeworkRes.status === "fulfilled")
        setListHomework(homeworkRes.value);
      if (examRes.status === "fulfilled") setListExam(examRes.value);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Trang chủ";
    loadData();
  }, []);
  const handleNavigate = (id: string) => {
    navigate(`/myCourse/${id}`);
  };
  const handlePageChangeHomework = (page: number) => {
    setPageHomework(() => page);
  };
  const handlePageChangeExam = (page: number) => {
    setPageExam(() => page);
  };
  const handleChangeDate = (date: string): string => {
    const newDate = new Date(date);
    const day = newDate.getDate().toString().padStart(2, "0"); // Ngày
    const month = (newDate.getMonth() + 1).toString().padStart(2, "0"); // Tháng
    const year = newDate.getFullYear(); // Năm
    const hours = newDate.getHours().toString().padStart(2, "0"); // Giờ
    const minutes = newDate.getMinutes().toString().padStart(2, "0"); // Phút
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
  return (
    <>
      {loading === false ? (
        <section className="bg-body-secondary">
          <section className="pt-5">
            <div className="container bg-white pb-5 pt-3 border border-white rounded-5">
              <div className="row">
                <div className="col-12">
                  <div className="row g-3">
                    <div className="col-12 text-center">
                      <h4 className="">Môn học của tôi </h4>
                    </div>
                  </div>
                  <div className="row row-cols-2 row-cols-md-4 row-col-xl-6 g-4 mt-3">
                    {listSubject.map((item, index) => (
                      <div
                        className="col"
                        key={index}
                        onClick={() =>
                          handleNavigate(item.subjectDetail.subject._id)
                        }
                      >
                        <div className="card">
                          <img
                            src={item.subjectDetail.image}
                            className="img-fluid object-fit-cover"
                            alt="Logo"
                          />
                          <div className="card-body">
                            <p className="card-text">
                              {system?.schoolYear} - {system?.semester}
                            </p>
                            <p className="card-text">
                              {item.subjectDetail.subject.name} -{" "}
                              {item.subjectDetail.grade}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="mt-5">
            <div className="container bg-white border border-white rounded-5 pt-3">
              <div className="row">
                <div className="col-12 text-center">
                  <h4 className="fs-4">Bài tập về nhà</h4>
                  <div className="text-secondary">
                    {listHomework?.myHomework?.length} bài kiểm tra đang được
                    giao
                  </div>
                </div>
              </div>
              <div className="row row-cols-2 row-cols-md-4 g-4 mt-3">
                {listHomework?.myHomework?.map((item) => (
                  <div className="col">
                    <div className="card h-100">
                      <div className="card-body">
                        <span className=" card-text bg-success-subtle text-success border border-success-subtle rounded-3 px-4">
                          {item.homework.subjectDetail.subject.name}
                        </span>
                        <h5 className="card-title mt-3">
                          {item.homework.name}
                        </h5>
                        <div className="card-text ">
                          Bắt đầu lúc:{" "}
                          {handleChangeDate(item.homework.startDate.toString())}
                        </div>
                        <div className="card-text">
                          Kết thúc lúc:
                          {handleChangeDate(item.homework.endDate.toString())}
                        </div>
                        <div className="row">
                          <div className="col-auto">
                            <p className="mb-0 mt-3">
                              <strong>{item.answers.length} câu</strong>
                            </p>
                            <p>Số câu hỏi</p>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer bg-success bg-gradient">
                        <div className="text-center  fw-bolder">
                          <Link
                            to={`/dasboadHomework/${item._id}`}
                            className="text-decoration-none link-light"
                          >
                            Làm bài tập về nhà
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="row">
                <div className="col-12">
                  <PaginationRect
                    totalPage={listHomework?.page?.totalPage ?? 0}
                    currentPage={listHomework?.page?.currentPage ?? 0}
                    onChangePage={handlePageChangeHomework}
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="mt-5 pb-5">
            <div className="container bg-white border border-white rounded-5 pt-3">
              <div className="row">
                <div className="col-12 text-center">
                  <h4 className="fs-4">Bài kiêm tra</h4>
                  <div className="text-secondary">
                    {listExam?.myExam?.length} bài kiểm tra đang được giao
                  </div>
                </div>
              </div>
              <div className="row row-cols-2 row-cols-md-4 g-4 mt-3">
                {listExam?.myExam?.map((item) => (
                  <div className="col">
                    <div className="card h-100">
                      <div className="card-body">
                        <span className=" card-text bg-success-subtle text-success border border-success-subtle rounded-3 px-4">
                          {item.exam.subjectDetail.subject.name}
                        </span>
                        <h5 className="card-title mt-3">{item.exam.name}</h5>
                        <div className="card-text ">
                          Bắt đầu lúc:{" "}
                          {handleChangeDate(item.exam.startDate.toString())}
                        </div>
                        <div className="card-text">
                          Kết thúc lúc:
                          {handleChangeDate(item.exam.endDate.toString())}
                        </div>
                        <div className="row">
                          <div className="col-auto">
                            <p className="mb-0 mt-3">
                              <strong>{item.answers.length} câu</strong>
                            </p>
                            <p>Số câu hỏi</p>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer bg-success bg-gradient">
                        <div className="text-center  fw-bolder">
                          <Link
                            to={`/dasboadExam/${item._id}`}
                            className="text-decoration-none link-light"
                          >
                            Làm bài tập về nhà
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="row">
                <div className="col-12">
                  <PaginationRect
                    totalPage={listExam?.page?.totalPage ?? 0}
                    currentPage={listExam?.page?.currentPage ?? 0}
                    onChangePage={handlePageChangeExam}
                  />
                </div>
              </div>
            </div>
          </section>
        </section>
      ) : (
        <LoadingReact />
      )}
    </>
  );
};

export default Home;
