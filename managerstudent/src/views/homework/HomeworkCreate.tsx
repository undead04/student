import * as React from "react";
import { useState, useEffect } from "react";
import subjectService, { ISubject } from "../../servers/subjectServer";
import questionService, { IQuestion } from "../../servers/questionServer";
import subjectDetailService, {
  ISubjectDetail,
} from "../../servers/subjectDetailServer";
import { useNavigate } from "react-router-dom";
import { IHomeworkModel } from "../../servers/homeworkServer";
import ModalReact from "../../Components/ModalReact";
import HomewordQuestion from "./HomeworkQuestion";
import HomeworkStep1 from "./HomeworkStep1";
import HomeworkStep2 from "./HomeworkStep2";
import homeworkService from "../../servers/homeworkServer";
import HomeworkStep3 from "./HomeworkStep3";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import teacherClassRoomService from "../../servers/teacherClassRoomServer";
import { IClassRoom } from "../../servers/classServer";
import { IStudent } from "../../servers/studentServer";
import { error } from "console";
import myHomeworkService, {
  IMyHomeworkModel,
} from "../../servers/myHomeworkServer";
export interface ISelectQuestion {
  tableOfContents: string;
  question: string[];
}
const HomeworkCreate = () => {
  const [homeworkModel, setHomeworkModel] = useState<IHomeworkModel>({
    name: "",
    subjectDetailId: "",
    classRoomId: [],
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    questionId: [],
  });
  const [checkDifferentQuestion, setCheckDifferentQuestion] =
    useState<boolean>(true);
  const [filterModel, setFilterModel] = useState({
    page: 1,
    pageSize: 10,
    subjectId: "",
    classRoomId: "",
    from: undefined,
    to: undefined,
    grade: "",
    tableOfContent: "",
    level: 0,
    isUpdate: false,
  });
  const [step, setStep] = useState(0);
  const [displayedQuestions, setDisplayedQuestions] = useState<string[]>([]);
  const [listQuestion, setListQuestion] = useState<IQuestion[]>([]);
  const [show, setShow] = useState(false);
  const [LoadingForm, setLoadingForm] = useState(true);
  const [listSubject, setListSubject] = useState<ISubject[]>([]);
  const [subjectDetail, setSubjectDetail] = useState<ISubjectDetail[]>([]);
  const [listGrade, setListGrade] = useState<string[]>([]);
  const [listClassRoom, setListClassRoom] = useState<IClassRoom[]>([]);
  const navigate = useNavigate();
  const [selectStudent, setSelectStudent] = useState<string[]>([]);
  const [selectQuestion, setSelectQuestion] = useState<ISelectQuestion[]>([]);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const role = userInfo?.user.role;
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (role?.includes("admin")) {
          const subjectResponse = await subjectService.list();
          setListSubject(subjectResponse.data.subject);
        } else {
          teacherClassRoomService.getStudent().then((res) => {
            const uniqueSubjectMap: Map<string, ISubject> = new Map();
            res.data.teacherClassRoom
              .flatMap((item) => item.subjectDetail.subject)
              .forEach((subject) => {
                uniqueSubjectMap.set(subject._id, subject); // Sử dụng id làm khóa để loại bỏ trùng lặp
              });

            const uniqueSubject: ISubject[] = Array.from(
              uniqueSubjectMap.values()
            );
            setListSubject(uniqueSubject);
          });
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  const loadData = async (
    subjectId?: string,
    classRoomId?: string,
    level?: number,
    tableOfContent?: string,
    page?: number,
    pageSize?: number
  ) => {
    if (!checkDifferentQuestion) {
      questionService
        .list("", subjectId, classRoomId, level?.toString(), tableOfContent)
        .then((res) => setListQuestion(res.data.question));
    } else {
      questionService
        .getTeacher(
          "",
          subjectId,
          classRoomId,
          level?.toString(),
          tableOfContent
        )
        .then((res) => setListQuestion(res.data.question));
    }
  };
  useEffect(() => {
    try {
      if (filterModel.grade && filterModel.subjectId) {
        subjectDetailService
          .list(filterModel.subjectId, filterModel.grade)
          .then((res) => {
            setSubjectDetail(res.data);
            setHomeworkModel({
              ...homeworkModel,
              subjectDetailId: res.data[0]._id,
            });
          });
      }
    } catch (error: any) {
      console.log(error);
    }
  }, [filterModel.grade, filterModel.subjectId]);
  useEffect(() => {
    try {
      if (
        filterModel.grade &&
        filterModel.subjectId &&
        filterModel.tableOfContent
      ) {
        loadData(
          filterModel.subjectId,
          filterModel.grade,
          filterModel.level,
          filterModel.tableOfContent
        );
      }
    } catch (error: any) {
      console.log(error);
    }
  }, [
    filterModel.grade,
    filterModel.subjectId,
    filterModel.tableOfContent,
    filterModel.level,
    checkDifferentQuestion,
  ]);
  useEffect(() => {
    try {
      if (filterModel.grade) {
        teacherClassRoomService
          .getStudent(undefined, filterModel.subjectId, filterModel.grade)
          .then((res) => {
            const uniqueClassRooms: IClassRoom[] = Array.from(
              new Set<IClassRoom>(
                res.data.teacherClassRoom.flatMap(
                  (item: { classRoom: IClassRoom }) => item.classRoom
                )
              )
            );
            setListClassRoom(uniqueClassRooms);
          });
      } else {
        setListClassRoom([]);
      }
    } catch (error: any) {
      console.log(error);
    }
  }, [filterModel.grade]);
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
  const handleSelect = (e: string | string[], name: string) => {
    console.log(e, name);
    setHomeworkModel({ ...homeworkModel, [name]: e });
  };
  const handleChangeFilter = (
    e: React.FormEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    let updatedFilterModel = {
      ...filterModel,
      [e.currentTarget.name]: e.currentTarget.value,
    };
    if (e.currentTarget.name === "subjectId") {
      updatedFilterModel.grade = "";
      setHomeworkModel({
        ...homeworkModel,
        classRoomId: [],
      });
    } else if (e.currentTarget.name === "grade") {
      setHomeworkModel({
        ...homeworkModel,
        classRoomId: [],
      });
    }
    setFilterModel(updatedFilterModel);
  };
  const handleChange = (
    e: React.FormEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setHomeworkModel({
      ...homeworkModel,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  const handleCheckMultiple = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isCheck = e.currentTarget.checked;
    if (isCheck) {
      setShow(isCheck);
      setFilterModel({
        ...filterModel,
        [e.currentTarget.name]: e.currentTarget.value,
        isUpdate: false,
      });
    } else {
      const newQuestion: ISelectQuestion[] = selectQuestion.filter(
        (item) => item.tableOfContents !== e.currentTarget.value
      );
      setSelectQuestion(newQuestion);
      setHomeworkModel({
        ...homeworkModel,
        questionId: [...newQuestion.flatMap((item) => item.question)],
      });
    }
  };

  const handleClose = () => {
    setShow(false);
    setLoadingForm(true);
    setDisplayedQuestions([]);
  };
  const handleLevel = (index: number) => {
    setFilterModel({
      ...filterModel,
      level: index,
    });
  };
  const handleRemoveQuestion = (value: string) => {
    let newQuestion = [...displayedQuestions];
    const indexArray = newQuestion.indexOf(value);
    newQuestion.splice(indexArray, 1);
    setDisplayedQuestions(newQuestion);
  };
  const handleAddQuestion = (value: string) => {
    setDisplayedQuestions([...displayedQuestions, value]);
  };
  const handleComplete = () => {
    if (!filterModel.isUpdate) {
      setSelectQuestion([
        ...selectQuestion,
        {
          tableOfContents: filterModel.tableOfContent,
          question: displayedQuestions,
        },
      ]);
      setHomeworkModel({
        ...homeworkModel,
        questionId: [...homeworkModel.questionId, ...displayedQuestions],
      });
      handleClose();
    } else {
      const newQuestion = [...selectQuestion];
      let index = newQuestion.findIndex(
        (item) => item.tableOfContents === filterModel.tableOfContent
      );
      newQuestion[index] = {
        ...newQuestion[index],
        question: displayedQuestions,
      };
      setSelectQuestion(newQuestion);
      setHomeworkModel({
        ...homeworkModel,
        questionId: [
          ...homeworkModel.questionId,
          ...newQuestion[index].question,
        ],
      });
      handleClose();
    }
  };
  const handleNext = () => {
    setStep(() => step + 1);
  };
  const handlePre = () => {
    setStep(() => step - 1);
  };
  const renderStepComponent = () => {
    switch (step) {
      case 0:
        return (
          <HomeworkStep1
            examModel={homeworkModel}
            handleChange={handleChange}
            handleChangeFilter={handleChangeFilter}
            handleSelect={handleSelect}
            listGrade={listGrade}
            listClassRoom={listClassRoom}
            listSubject={listSubject}
            filterModel={filterModel}
            handleNext={handleNext}
          />
        );
        break;
      case 1:
        return (
          <HomeworkStep2
            subjectDetail={subjectDetail}
            selectQuestion={selectQuestion}
            handleCheckMultiple={handleCheckMultiple}
            handleNext={() => handleNext()}
            handlePre={handlePre}
            handleEdit={handleEdit}
          />
        );
        break;
      case 2:
        return (
          <HomeworkStep3
            setSelectStudent={setSelectStudent}
            selectStudent={selectStudent}
            homeworkModel={homeworkModel}
            handleSave={() => handleSave("")}
            handlePre={handlePre}
          />
        );
    }
  };
  const handleEdit = (item: ISelectQuestion) => {
    setDisplayedQuestions(item.question);
    setFilterModel({
      ...filterModel,
      tableOfContent: item.tableOfContents,
      isUpdate: true,
    });
    setShow(true);
    console.log(item.question);
  };
  const handleSave = async (id: string) => {
    if (id === "") {
      try {
        const responseHomework = await homeworkService.add(homeworkModel);
        const responseQuestion = await homeworkService.get(
          responseHomework.data
        );
        console.log(responseQuestion);
        const myHomeworkPromises = selectStudent.map(async (element) => {
          const myHomeworkModel: IMyHomeworkModel = {
            homeworkId: responseHomework.data,
            answers: responseQuestion.data.question.map((item) => ({
              questionId: item._id,
              answer: [],
            })),
            userId: element,
          };

          return myHomeworkService.add(myHomeworkModel);
        });
        await Promise.all(myHomeworkPromises);
        toast.done("Tạo bài tập về nhà thành công");
        handleNavigate();
      } catch (error: any) {
        toast.error("Tạo bài tập về nhà thất bại");
        console.log(error);
      }
    } else {
      await homeworkService.update(id, homeworkModel);
      handleNavigate();
    }
  };
  const handleNavigate = () => {
    navigate("/homework");
  };

  return (
    <>
      <ModalReact
        handleClose={handleClose}
        handleSave={handleComplete}
        title={`Chọn câu hỏi`}
        labelClose="Đóng"
        labelSave="Hoàn thành"
        data={
          <HomewordQuestion
            question={listQuestion}
            level={filterModel.level}
            handleLevel={handleLevel}
            handleAddQuesion={handleAddQuestion}
            selectedQuestion={displayedQuestions}
            handleRemoveQuestion={handleRemoveQuestion}
            checkDifferentQuestion={checkDifferentQuestion}
            setCheckDifferentQuestion={setCheckDifferentQuestion}
          />
        }
        show={show}
        size="modal-xl"
      />
      {}
      {renderStepComponent()}
    </>
  );
};
export default HomeworkCreate;
