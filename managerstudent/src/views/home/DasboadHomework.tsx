import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import homeworkService, { IHomework } from "../../servers/homeworkServer";
import myHomeworkService, { IMyHomework } from "../../servers/myHomeworkServer";
import examService, { IExam, IExamModel } from "../../servers/examServer";
import myExamService, { IMyExam } from "../../servers/myExamServer";
import LoadingReact from "../../Components/LoadingReact";
interface Prop {
  isExam: boolean;
}
const DasboadHomework: React.FC<Prop> = ({ isExam }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [myHomework, setMyHomework] = useState<Partial<IMyHomework>>();
  const [myExam, setMyExam] = useState<Partial<IMyExam>>();
  const [loading, setLoading] = useState<boolean>(true);
  const [homework, setHomework] = useState<Partial<IHomework>>();
  const [exam, setExam] = useState<Partial<IExam>>();
  const loadData = async () => {
    try {
      if (!isExam) {
        const myHomeworkResponse = await myHomeworkService
          .get(id ?? "")
          .then((res) => res.data);
        setMyHomework(myHomeworkResponse);
        setHomework(myHomeworkResponse.homework);
      } else {
        const myExamResponse = await myExamService
          .get(id ?? "")
          .then((res) => res.data);
        setMyExam(myExamResponse);
        setExam(myExamResponse.exam);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    document.title = "dasboad";
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
      <section className="mt-3">
        <div className="container border p-3 bg-body-tertiary">
          <div className="row">
            <div className="col-12 fs-1">
              {!isExam
                ? `${homework?.subjectDetail?.subject.name}-
                ${homework?.subjectDetail?.grade}`
                : `${exam?.subjectDetail?.subject.name}-
                ${exam?.subjectDetail?.grade}`}
            </div>
          </div>
        </div>
      </section>
      {loading === false ? (
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
                    ? handleChangeDate(homework?.startDate?.toString() ?? "")
                    : handleChangeDate(exam?.startDate?.toString() ?? "")}
                </p>
                <p className="">
                  <span className="fw-bold">Ngày kết thúc</span>:{" "}
                  {!isExam
                    ? handleChangeDate(homework?.endDate?.toString() ?? "")
                    : handleChangeDate(exam?.endDate?.toString() ?? "")}
                </p>
              </div>
              <hr />
              {(myHomework?.status || myExam?.status) && (
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
                            ? handleChangeDate(
                                myHomework?.create_at?.toString() ?? ""
                              )
                            : handleChangeDate(
                                myExam?.create_at?.toString() ?? ""
                              )}
                        </td>
                        <td>
                          <a
                            className="text-decoration-none"
                            href={
                              !isExam
                                ? `/myHomeworkDetail/${myHomework?._id}`
                                : `/myExamDetail/${myExam?._id}`
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
                    ? myHomework?.status === false &&
                      homework?.startDate &&
                      homework?.endDate &&
                      new Date() >= new Date(homework.startDate) &&
                      new Date() <= new Date(homework.endDate) && (
                        <div className="col">
                          <button
                            className="btn btn-secondary px-3"
                            onClick={() =>
                              handleNavigateMyHomework(myHomework._id ?? "")
                            }
                          >
                            Làm bài
                          </button>
                        </div>
                      )
                    : myExam?.status === false &&
                      exam?.startDate &&
                      exam?.endDate &&
                      new Date() >= new Date(exam.startDate) &&
                      new Date() <= new Date(exam.endDate) && (
                        <div className="col">
                          <button
                            className="btn btn-secondary px-3"
                            onClick={() => handleNavigateExam(myExam._id ?? "")}
                          >
                            Làm bài
                          </button>
                        </div>
                      )}
                  <div
                    className="col"
                    onClick={() =>
                      handleBack(
                        isExam
                          ? exam?.subjectDetail?.subject?._id ?? ""
                          : homework?.subjectDetail?.subject?._id ?? ""
                      )
                    }
                  >
                    <button className="btn btn-secondary px-3">Trở về</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <LoadingReact />
      )}
    </>
  );
};
export default DasboadHomework;
