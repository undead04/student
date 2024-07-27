import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import homeworkService, { IHomework } from "../../servers/homeworkServer";
import myHomeworkService, { IMyHomework } from "../../servers/myHomeworkServer";
import examService, { IExam, IExamModel } from "../../servers/examServer";
import myExamService, { IMyExam } from "../../servers/myExamServer";
import teacherClassRoomService, {
  ITeacherRoom,
} from "../../servers/teacherClassRoomServer";
interface Prop {
  isExam: boolean;
}
const DasboadHomework: React.FC<Prop> = ({ isExam }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [homework, setHomework] = useState<Partial<IHomework>>();
  const [myHomework, setmyHomework] = useState<Partial<IMyHomework>>();
  const [exam, setExam] = useState<Partial<IExam>>();
  const [myExam, setMyExam] = useState<Partial<IMyExam>>();
  const [teacherClassRoom, setTeacherClassRoom] =
    useState<Partial<ITeacherRoom>>();
  const loadData = async () => {
    if (!isExam) {
      const response = await homeworkService
        .get(id ?? "")
        .then((res) => res.data);
      setHomework(response);
      await teacherClassRoomService
        .getStudent(response.subjectDetail._id)
        .then((res) => setTeacherClassRoom(res.data[0]));
      try {
        await myHomeworkService
          .get(id ?? "")
          .then((res) => setmyHomework(res.data));
      } catch (error: any) {
        console.log(error);
      }
    } else {
      const responseExam = await examService
        .get(id ?? "")
        .then((res) => res.data);
      setExam(responseExam);
      await teacherClassRoomService
        .getStudent(responseExam.subjectDetail._id)
        .then((res) => setTeacherClassRoom(res.data[0]));
      try {
        await myExamService.get(id ?? "").then((res) => setMyExam(res.data));
      } catch (error: any) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  const handleBack = (id: string) => {
    navigate(`/myCourse/${id}`);
  };
  const handleNavigateExam = (id: string) => {
    navigate(`/myExam/${id}`);
  };
  const handleNavigateMyHomework = (id: string) => {
    navigate(`/myHomework/${id}`);
  };
  console.log(teacherClassRoom);
  return (
    <>
      <section className="mt-3">
        <div className="container border p-3 bg-body-tertiary">
          <div className="row">
            <div className="col-12 fs-1">
              {!isExam
                ? `${homework?.subjectDetail?.subject.name}-
                ${homework?.subjectDetail?.grade}`
                : `${exam?.subjectDetail?.subject.name}`}
              -{exam?.subjectDetail?.grade}
            </div>
          </div>
        </div>
      </section>
      <section className="mt-3">
        <div className="container border bg-body-tertiary p-3">
          <div className="row">
            <div className="col-12">
              <p className="fs-3">
                {!isExam ? `${homework?.name}` : `${exam?.name}`}
              </p>
              <p className="m-0">
                <span className="fw-bold"> Ngày bắt đầu</span>:{" "}
                {!isExam
                  ? `${homework?.startDate?.toString().split("T")[0]}, ${
                      homework?.startDate
                        ?.toString()
                        .split("T")[1]
                        .split(".")[0]
                    }`
                  : `${exam?.startDate?.toString().split("T")[0]}, ${
                      exam?.startDate?.toString().split("T")[1].split(".")[0]
                    }`}
              </p>
              <p className="">
                <span className="fw-bold">Ngày kết thúc</span>:{" "}
                {!isExam
                  ? `${homework?.endDate?.toString().split("T")[0]}, ${
                      homework?.endDate?.toString().split("T")[1].split(".")[0]
                    }`
                  : `${exam?.endDate?.toString().split("T")[0]}, ${
                      exam?.endDate?.toString().split("T")[1].split(".")[0]
                    }`}
              </p>
            </div>
            <hr />
            {(myHomework || myExam) && (
              <div className="col-12">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Tên </th>
                      <th scope="col">Ngày làm</th>
                      <th scope="col">Xem</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">
                        {!isExam
                          ? `${myHomework?.homework?.name}`
                          : `${myExam?.exam?.name}`}
                      </th>
                      <td>
                        {!isExam
                          ? `${
                              myHomework?.create_at?.toString().split("T")[0]
                            } ${
                              myHomework?.create_at?.toString().split("T")[1]
                            }`
                          : `${myExam?.create_at?.toString().split("T")[0]} ${
                              myExam?.create_at?.toString().split("T")[1]
                            }`}
                      </td>
                      <td>
                        <a
                          className="text-decoration-none"
                          href={
                            !isExam
                              ? `/myHomeworkDetail/${id}`
                              : `/myExamDetail/${id}`
                          }
                        >
                          Xem
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            <div className="col-12 text-center">
              <div className="row">
                {!isExam
                  ? myHomework === undefined &&
                    homework?.startDate &&
                    homework?.endDate &&
                    new Date() >= new Date(homework.startDate) &&
                    new Date() <= new Date(homework.endDate) && (
                      <div className="col">
                        <button
                          className="btn btn-secondary px-3"
                          onClick={() =>
                            handleNavigateMyHomework(homework._id ?? "")
                          }
                        >
                          Làm bài
                        </button>
                      </div>
                    )
                  : myExam === undefined &&
                    exam?.startDate &&
                    exam?.endDate &&
                    new Date() >= new Date(exam.startDate) &&
                    new Date() <= new Date(exam.endDate) && (
                      <div className="col">
                        <button
                          className="btn btn-secondary px-3"
                          onClick={() => handleNavigateExam(exam._id ?? "")}
                        >
                          Làm bài
                        </button>
                      </div>
                    )}
                <div
                  className="col"
                  onClick={() => handleBack(teacherClassRoom?._id ?? "")}
                >
                  <button className="btn btn-secondary px-3">Trở về</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default DasboadHomework;
