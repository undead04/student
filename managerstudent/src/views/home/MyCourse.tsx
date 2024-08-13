import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import teacherClassRoomService, {
  ITeacherRoom,
} from "../../servers/teacherClassRoomServer";
import myHomeworkService, { IMyHomework } from "../../servers/myHomeworkServer";
import myExamService, { IMyExam } from "../../servers/myExamServer";
const MyCourse = () => {
  const [listHomework, setListHomework] = useState<IMyHomework[]>([]);
  const [listExam, setListExam] = useState<IMyExam[]>([]);
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
      .getStudent(undefined, id)
      .then((res) => res.data.teacherClassRoom);
    setSubject(response[0]);
    await myHomeworkService
      .getListStudent(response[0].subjectDetail._id)
      .then((res) => setListHomework(res.data.myHomework));
    await myExamService
      .getListStudent(response[0].subjectDetail._id)
      .then((res) => setListExam(res.data.myExam));
  };
  useEffect(() => {
    document.title = `Môn ${subject.subjectDetail?.subject.name}`;
    loadData();
  }, []);
  const handleChangeDate = (date: string): string => {
    const newDate = new Date(date);
    const day = newDate.getDate().toString().padStart(2, "0"); // Ngày
    const month = (newDate.getMonth() + 1).toString().padStart(2, "0"); // Tháng
    const year = newDate.getFullYear(); // Năm
    const hours = newDate.getHours().toString().padStart(2, "0"); // Giờ
    const minutes = newDate.getMinutes().toString().padStart(2, "0"); // Phút
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
  const handleRender = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="row  g-3">
            {listHomework.map((item, index) => (
              <>
                <div className="col" key={index}>
                  <p>
                    <Link
                      to={`/dasboadHomework/${item._id}`}
                      className="text-primary text-decoration-none"
                    >
                      <i className="fa-brands fa-phoenix-framework"></i>{" "}
                      {item.homework.name}
                    </Link>
                  </p>
                  <p className="m-0">
                    <span className="fw-bold"> Ngày bắt đầu</span>:{" "}
                    {handleChangeDate(item.homework.startDate.toString())}
                  </p>
                  <p className="m-0">
                    <span className="fw-bold">Ngày kết thúc</span>:{" "}
                    {handleChangeDate(item.homework.endDate.toString())}
                  </p>
                </div>
                <div className="col-auto align-self-end">
                  {" "}
                  <div
                    className={`${
                      item.status && "text-bg-success"
                    } py-2 px-3 fw-bold`}
                  >
                    {item.status ? "Hoàn thành" : "Chưa hoàn Thành"}
                  </div>
                </div>
                <hr />
              </>
            ))}
          </div>
        );
      case 1:
        return (
          <div className="row  g-3">
            {listExam.map((item, index) => (
              <>
                <div className="col" key={index}>
                  <p>
                    <Link
                      to={`/dasboadExam/${item._id}`}
                      className="text-primary text-decoration-none"
                    >
                      <i className="fa-brands fa-phoenix-framework"></i>{" "}
                      {item.exam.name}
                    </Link>
                  </p>
                  <p className="m-0">
                    <span className="fw-bold"> Ngày bắt đầu</span>:{" "}
                    {item.exam.startDate.toString().split("T")[0]}
                  </p>
                  <p className="m-0">
                    <span className="fw-bold">Ngày kết thúc</span>:{" "}
                    {item.exam.endDate.toString().split("T")[0]}
                  </p>
                </div>
                <div className="col-auto align-self-end">
                  {" "}
                  <div
                    className={`${
                      item.status && "text-bg-success"
                    } py-2 px-3 fw-bold`}
                  >
                    {item.status ? "Hoàn thành" : "Chưa hoàn Thành"}
                  </div>
                </div>
                <hr />
              </>
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
