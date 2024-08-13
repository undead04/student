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
import LoadingReact from "../../Components/LoadingReact";
import { IQuestion } from "../../servers/questionServer";
import PaginationRect from "../../Components/PaginationReact";
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
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<IQuestion[]>([]);
  const navigate = useNavigate();
  const loadData = async (classRoomId?: string, page?: number) => {
    document.title = !isExam
      ? "Thông kê bài tập về nhà"
      : "Thống kề bài kiểm tra";
    try {
      if (!isExam) {
        const [statisticalHomeworkRes, homeworkRes] = await Promise.allSettled([
          statiscalHomeworkService
            .get(id as string, classRoomId, page)
            .then((res) => res.data),
          homeworkService.get(id as string).then((res) => res.data),
        ]);

        if (statisticalHomeworkRes.status === "fulfilled") {
          setStatisticalHomework(statisticalHomeworkRes.value);
        }
        if (homeworkRes.status === "fulfilled") {
          setHomework(homeworkRes.value);
          setQuestion(homeworkRes.value.question);
        }
      } else {
        const [statisticalExamRes, ExamRes] = await Promise.allSettled([
          statiscalExamService
            .get(id ?? "", classRoomId, page)
            .then((res) => res.data),
          examService.get(id ?? "").then((res) => res.data),
        ]);
        if (statisticalExamRes.status === "fulfilled")
          setStatisticalExam(statisticalExamRes.value);

        if (ExamRes.status === "fulfilled") {
          setExam(ExamRes.value);
          setQuestion(ExamRes.value.question);
        }
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
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
  const handleChangeDate = (date: string): string => {
    const newDate = new Date(date);
    const day = newDate.getDate().toString().padStart(2, "0"); // Ngày
    const month = (newDate.getMonth() + 1).toString().padStart(2, "0"); // Tháng
    const year = newDate.getFullYear(); // Năm
    const hours = newDate.getHours().toString().padStart(2, "0"); // Giờ
    const minutes = newDate.getMinutes().toString().padStart(2, "0"); // Phút
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
  const handleCorrectAnswer = (
    question: IQuestion[],
    answers: {
      questionId: string;
      answer: string[];
    }[]
  ): number => {
    const count = question.filter((item, index) => {
      const answerIndex = answers.find(
        (answer) => answer.questionId === item._id
      );
      if (answerIndex) {
        return item.answer.every((answer) =>
          answerIndex.answer.includes(answer)
        );
      }
    });
    return count.length;
  };
  const handlePageChange = (page: number) => {
    setPage(page);
  };
  return (
    <>
      {loading === false ? (
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
                          : homework.classRoom
                              ?.map((item) => item.name)
                              .join(", ")}
                      </>
                    ) : (
                      <>
                        CHI TIẾT BÀI KIỂM TRA {exam?.name} -{" "}
                        {classRoom
                          ? exam.classRoom?.find(
                              (item) => item._id === classRoom
                            )?.name
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
                      <th scope="col" className="text-center" colSpan={3}>
                        THỐNG KỂ SỐ HỌC SINH LÀM{" "}
                        {isExam ? "BÀI KIỂM TRA" : "BÀI TẬP VỀ NHÀ"}
                      </th>
                    </tr>
                    <tr>
                      <th scope="col">TỔNG BÀI LÀM</th>
                      <th scope="col">TỔNG HỌC SINH ĐÃ LÀM BÀI</th>
                      <th scope="col">HỌC SINH CHƯA LÀM BÀI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {!isExam
                          ? statisticalHomework.page?.totalDocument
                          : statisticalExam.page?.totalDocument}
                      </td>
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
                      <th>ĐIỂM</th>
                      <th>ĐÚNG</th>
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
                            {item.status ? (
                              <>
                                <td>
                                  {handleChangeDate(item.create_at.toString())}
                                </td>
                                <td>
                                  {(handleCorrectAnswer(
                                    question,
                                    item.answers
                                  ) /
                                    question.length) *
                                    10}
                                </td>
                                <td>
                                  {`${handleCorrectAnswer(
                                    question ?? [],
                                    item.answers
                                  )}/ ${question.length}`}
                                </td>
                                <td>
                                  <Link
                                    className="text-decoration-none"
                                    to={`/statisticalHomeworkDetail/${item._id}`}
                                  >
                                    Xem chi tiết
                                  </Link>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="text-danger">KHÔNG NỘP BÀI</td>
                                <td></td>
                                <td></td>
                              </>
                            )}
                          </tr>
                        ))
                      : statisticalExam?.exam?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.user?.name}</td>
                            <td>{item?.user?.classRoom?.name}</td>
                            {item.status ? (
                              <>
                                <td>
                                  {handleChangeDate(item.create_at.toString())}
                                </td>
                                <td>
                                  {(handleCorrectAnswer(
                                    question,
                                    item.answers
                                  ) /
                                    question.length) *
                                    10}
                                </td>
                                <td>
                                  {`${handleCorrectAnswer(
                                    question ?? [],
                                    item.answers
                                  )}/ ${question.length}`}
                                </td>
                                <td>
                                  <Link
                                    className="text-decoration-none"
                                    to={`/statisticalExamDetail/${item._id}`}
                                  >
                                    Xem chi tiết
                                  </Link>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="text-danger">KHÔNG NỘP BÀI</td>
                                <td></td>
                                <td></td>
                              </>
                            )}
                          </tr>
                        ))}
                  </tbody>
                </table>
                <PaginationRect
                  currentPage={
                    !isExam
                      ? statisticalHomework.page?.currentPage || 1
                      : statisticalExam.page?.currentPage || 1
                  }
                  totalPage={
                    !isExam
                      ? statisticalHomework.page?.totalPage || 10
                      : statisticalExam.page?.totalPage || 10
                  }
                  onChangePage={handlePageChange}
                />
              </div>
            </div>
          </section>
        </>
      ) : (
        <LoadingReact />
      )}
    </>
  );
};

export default Statistical;
