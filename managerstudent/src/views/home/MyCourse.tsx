import * as React from "react";
import { useState, useEffect } from "react";
import homeworkService, {
  IHomework,
  IListHomework,
} from "../../servers/homeworkServer";
import { Link, useNavigate, useParams } from "react-router-dom";
import examService, { IExam } from "../../servers/examServer";
import teacherClassRoomService, {
  ITeacherRoom,
} from "../../servers/teacherClassRoomServer";
const MyCourse = () => {
  const [listHomework, setListHomework] = useState<IHomework[]>([]);
  const [listExam, setListExam] = useState<IExam[]>([]);
  const [subject, setSubject] = useState<Partial<ITeacherRoom>>({ _id: "" });
  const { id } = useParams();
  const listSemster = ["Học kì 1", "Học kì 2"];
  const listCategory = [
    {
      value: 0,
      key: "Bài tập về nhà",
    },
    {
      value: 1,
      key: "Bài kiểm tra",
    },
  ];
  const [category, setCategory] = useState<number>(0);
  const [semstems, setSemstems] = useState<number>(-1);
  const loadData = async () => {
    const response = await teacherClassRoomService
      .get(id as string)
      .then((res) => res.data);
    setSubject(response);
    await homeworkService
      .list(response.subjectDetail?.subject._id, response.classRoom._id)
      .then((res) => setListHomework(res.data.homework));
    await examService
      .list(response.subjectDetail.subject._id, response.classRoom._id)
      .then((res) => setListExam(res.data.exam));
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleRender = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="row  g-3">
            {listHomework.map((item, index) => (
              <div className="col-12" key={index}>
                <p>
                  <Link
                    to={`/dasboadHomework/${item._id}`}
                    className="text-primary text-decoration-none"
                  >
                    <i className="fa-brands fa-phoenix-framework"></i>{" "}
                    {item.name}
                  </Link>
                </p>
                <p className="m-0">
                  <span className="fw-bold"> Ngày bắt đầu</span>:{" "}
                  {item.startDate.toString().split("T")[0]}
                </p>
                <p className="m-0">
                  <span className="fw-bold">Ngày kết thúc</span>:{" "}
                  {item.endDate.toString().split("T")[0]}
                </p>
                <hr />
              </div>
            ))}
          </div>
        );
      case 1:
        return (
          <div className="row  g-3">
            {listExam.map((item, index) => (
              <div className="col-12" key={index}>
                <p>
                  <Link
                    to={`/dasboadExam/${item._id}`}
                    className="text-primary text-decoration-none"
                  >
                    <i className="fa-brands fa-phoenix-framework"></i>{" "}
                    {item.name}
                  </Link>
                </p>
                <p className="m-0">
                  <span className="fw-bold"> Ngày bắt đầu</span>:{" "}
                  {item.startDate.toString().split("T")[0]}
                </p>
                <p className="m-0">
                  <span className="fw-bold">Ngày kết thúc</span>:{" "}
                  {item.endDate.toString().split("T")[0]}
                </p>
                <hr />
              </div>
            ))}
          </div>
        );
    }
  };
  return (
    <>
      <section className="mt-3">
        <div className="container border p-3 bg-body-tertiary">
          <div className="row">
            <div className="col-12 fs-1">
              {subject.subjectDetail?.subject.name}-
              {subject.subjectDetail?.grade}
            </div>
            <div className="col-12">Giáo viên: {subject.teacher?.name}</div>
            <div className="col-12">Lớp: {subject.classRoom?.name}</div>
          </div>
        </div>
      </section>
      <section className="mt-3">
        <div className="container border bg-body-tertiary p-3">
          <div className="row">
            <div className="col-2">
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(Number(e.currentTarget.value))}
              >
                <option value={-1} hidden>
                  Chọn thể loại
                </option>
                {listCategory.map((item, index) => (
                  <option value={item.value} key={index}>
                    {item.key}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-2">
              <select
                className="form-select"
                value={semstems}
                onChange={(e) => setSemstems(Number(e.currentTarget.value))}
              >
                <option value={-1} hidden>
                  Chọn học kì
                </option>
                {listSemster.map((item, index) => (
                  <option value={index} key={index}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <section className="mt-3">{handleRender(category)}</section>
        </div>
      </section>
    </>
  );
};

export default MyCourse;
