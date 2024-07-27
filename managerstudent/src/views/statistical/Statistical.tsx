import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import statiscalHomeworkService, {
  IStatiscalHomework,
} from "../../servers/statiscalHomework";
import homeworkService, { IHomework } from "../../servers/homeworkServer";
import examService, { IExam } from "../../servers/examServer";
import statiscalExamService, {
  IStatiscalExam,
} from "../../servers/statiscalExamServer";
interface Prop {
  isExam: boolean;
}
const Statistical: React.FC<Prop> = ({ isExam }) => {
  const { id } = useParams();
  const [statisticalHomework, setStatisticalHomework] = useState<
    Partial<IStatiscalHomework>
  >({});
  const [statisticalExam, setStatisticalExam] = useState<
    Partial<IStatiscalExam>
  >({});
  const [homework, setHomework] = useState<Partial<IHomework>>({ _id: "" });
  const [exam, setExam] = useState<Partial<IExam>>({ _id: "" });
  const [classRoom, setClassRoom] = useState<string>("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const loadData = async (classRoomId?: string, page?: number) => {
    try {
      if (!isExam) {
        await statiscalHomeworkService
          .get(id ?? "", classRoomId, page)
          .then((res) => {
            setStatisticalHomework(res.data);
          });

        await homeworkService.get(id ?? "").then((res) => {
          setHomework(res.data);
        });
      } else {
        await statiscalExamService
          .get(id ?? "", classRoomId, page)
          .then((res) => setStatisticalExam(res.data));
        await examService.get(id ?? "").then((res) => setExam(res.data));
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadData(classRoom, page);
  }, [classRoom, page]);
  const handleBack = () => {
    if (isExam) {
      navigate("/homework");
    } else {
      navigate("/exam");
    }
  };
  console.log(statisticalExam);
  return (
    <>
      <section className="mt-3">
        <div className="container">
          <div className="row g-3">
            <div className="col">
              <p className="fs-4">
                {!isExam ? (
                  <>
                    CHI TIẾT BÀI TẬP VỀ NHÀ {homework?.name} -{" "}
                    {classRoom
                      ? homework.classRoom?.find(
                          (item) => item._id === classRoom
                        )?.name
                      : homework.classRoom?.map((item) => item.name).join(", ")}
                  </>
                ) : (
                  <>
                    CHI TIẾT BÀI KIỂM TRA {exam?.name} -{" "}
                    {classRoom
                      ? exam.classRoom?.find((item) => item._id === classRoom)
                          ?.name
                      : exam.classRoom?.map((item) => item.name).join(", ")}
                  </>
                )}
              </p>
            </div>
            <div className="col-auto">
              <Link
                to={!isExam ? "/homework" : "/exam"}
                className="btn btn-success"
              >
                <i className="fa-solid fa-left-long"></i> Quay lại
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col-3">
              <select
                className="form-select"
                value={classRoom}
                onChange={(e) => setClassRoom(e.currentTarget.value)}
              >
                <option value="" hidden>
                  Chọn tất cả
                </option>
                {!isExam
                  ? homework.classRoom?.map((item, index) => (
                      <option value={item._id} key={index}>
                        {item.name}
                      </option>
                    ))
                  : exam.classRoom?.map((item, index) => (
                      <option value={item._id} key={index}>
                        {item.name}
                      </option>
                    ))}
              </select>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-3">
        <div className="container">
          <div className="row g-3">
            <table className="table table-bordered">
              <thead className="table-success ">
                <tr>
                  <th scope="col" className="text-center" colSpan={2}>
                    THỐNG KỂ SỐ HỌC SINH LÀM{" "}
                    {isExam ? "BÀI KIỂM TRA" : "BÀI TẬP VỀ NHÀ"}
                  </th>
                </tr>
                <tr>
                  <th scope="col">TỖNG HỌC SINH ĐÃ LÀM BÀI</th>
                  <th scope="col">HỌC SINH CHƯA LÀM BÀI</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {!isExam
                      ? statisticalHomework.done?.toString()
                      : statisticalExam.done}
                  </td>
                  <td>
                    {!isExam
                      ? statisticalHomework.unfinished?.toString()
                      : statisticalExam.unfinished}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="mt-3">
        <div className="container">
          <div className="row g-3">
            <table className="table table-bordered">
              <thead className="table-success">
                <tr>
                  <th>STT</th>
                  <th>HỌC SINH</th>
                  <th>LỚP</th>
                  <th>NGÀY NỘP</th>
                  <th>Xem chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {!isExam
                  ? statisticalHomework?.homework?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item?.user?.name}</td>
                        <td>{item?.user?.classRoom?.name}</td>
                        <td>{item?.create_at.toString()}</td>
                        <td>
                          <Link
                            className="text-decoration-none"
                            to={`/statisticalHomeworkDetail/${item._id}`}
                          >
                            Xem chi tiết
                          </Link>
                        </td>
                      </tr>
                    ))
                  : statisticalExam?.exam?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item?.user?.name}</td>
                        <td>{item?.user?.classRoom?.name}</td>
                        <td>{item?.create_at.toString()}</td>
                        <td>
                          <Link
                            className="text-decoration-none"
                            to={`/statisticalExamDetail/${item._id}`}
                          >
                            Xem chi tiết
                          </Link>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default Statistical;
