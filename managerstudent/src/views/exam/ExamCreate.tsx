import * as React from "react";
import { useState, useEffect } from "react";
import subjectService, { ISubject } from "../../servers/subjectServer";
import questionService, {
  IQuestion,
  IRandomQuestion,
} from "../../servers/questionServer";
import subjectDetailService, {
  ISubjectDetail,
} from "../../servers/subjectDetailServer";
import { useNavigate } from "react-router-dom";
import { IClassRoom } from "../../servers/classServer";
import ModalReact from "../../Components/ModalReact";
import ExamStep1 from "./ExamStep1";
import ExamStep2 from "./ExamStep2";
import HomewordQuestion from "../homework/HomeworkQuestion";
import examService, { IExamModel } from "../../servers/examServer";
import ExamStep3 from "./ExamStep3";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import teacherClassRoomService from "../../servers/teacherClassRoomServer";
import { IMyHomeworkModel } from "../../servers/myHomeworkServer";
import myExamService, { IMyExamModel } from "../../servers/myExamServer";
import { toast } from "react-toastify";
export interface ISelectQuestion {
  tableOfContents: string;
  question: string[];
}
const ExamCreate = () => {
  const [examModel, setexamModel] = useState<IExamModel>({
    name: "",
    subjectDetailId: "",
    classRoomId: [],
    answerDate: new Date(),
    startDate: new Date(),
    endDate: new Date(),
    questionId: [],
  });
  const [checkDifferentQuestion, setCheckDifferentQuestion] =
    useState<boolean>(true);
  const [selectStudent, setSelectStudent] = useState<string[]>([]);
  const [selectRandomQuestion, setSelectRandomQuestion] = useState<
    IRandomQuestion[]
  >([]);
  const [filterModel, setFilterModel] = useState({
    page: 1,
    pageSize: 10,
    subjectId: "",
    classRoomId: "",
    grade: "",
    tableOfContent: "",
    level: 0,
    isUpdate: false,
    isAuto: false,
    numberQuestion: 0,
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
  const [selectQuestion, setSelectQuestion] = useState<ISelectQuestion[]>([]);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const role = userInfo?.user.role;
  const loadData = async (
    subjectId?: string,
    classRoomId?: string,
    level?: number,
    tableOfContent?: string
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
    document.title = "Tạo bài kiểm tra";
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
  useEffect(() => {
    try {
      if (filterModel.grade && filterModel.subjectId) {
        subjectDetailService
          .list(filterModel.subjectId, filterModel.grade)
          .then((res) => {
            setSubjectDetail(res.data);
            setexamModel({
              ...examModel,
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
    setexamModel({ ...examModel, [name]: e });
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
      setexamModel({
        ...examModel,
        classRoomId: [],
      });
    } else if (e.currentTarget.name === "grade") {
      setexamModel({
        ...examModel,
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
    setexamModel({
      ...examModel,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  const handleCheckAutoQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterModel({
      ...filterModel,
      [e.currentTarget.name]: e.currentTarget.checked,
    });
  };
  const handleCheckMultiple = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isCheck = e.currentTarget.checked;
    if (isCheck) {
      setFilterModel({
        ...filterModel,
        [e.currentTarget.name]: e.currentTarget.value,
        isUpdate: false,
      });
      if (filterModel.isAuto == false) {
        setShow(isCheck);
      } else {
        const selectedQuestion: ISelectQuestion = {
          tableOfContents: e.currentTarget.value,
          question: [],
        };
        const autoQuestion: IRandomQuestion = {
          subjectDetailId: subjectDetail[0]._id,
          tableOfContents: e.currentTarget.value,
          numberHightQuestion: 0,
          numberLowQuestion: 0,
          numberMediumQuestion: 0,
        };
        setSelectRandomQuestion([...selectRandomQuestion, autoQuestion]);
        setSelectQuestion([...selectQuestion, selectedQuestion]);
      }
    } else {
      const newQuestion: ISelectQuestion[] = selectQuestion.filter(
        (item) => item.tableOfContents !== e.currentTarget.value
      );
      setSelectQuestion(newQuestion);
      setexamModel({
        ...examModel,
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
      setexamModel({
        ...examModel,
        questionId: [...examModel.questionId, ...displayedQuestions],
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
      setexamModel({
        ...examModel,
        questionId: [...examModel.questionId, ...newQuestion[index].question],
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
  const handleChangeSelectQuestionAuto = (
    index: number,
    e: React.FormEvent<HTMLInputElement>
  ) => {
    console.log(e.currentTarget.name);
    let newQuestion = [...selectRandomQuestion];
    newQuestion[index] = {
      ...newQuestion[index],
      [e.currentTarget.name]: [e.currentTarget.value],
    };
    setSelectRandomQuestion(newQuestion);
  };
  const renderStepComponent = () => {
    switch (step) {
      case 0:
        return (
          <ExamStep1
            handleCheck={handleCheckAutoQuestion}
            examModel={examModel}
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
          <ExamStep2
            handlechange={handleChangeSelectQuestionAuto}
            filterModel={filterModel}
            subjectDetail={subjectDetail}
            selectQuestion={selectQuestion}
            handleCheckMultiple={handleCheckMultiple}
            handleNext={handleNext}
            handlePre={handlePre}
            handleEdit={handleEdit}
          />
        );
        break;
      case 2:
        return (
          <ExamStep3
            examModel={examModel}
            handlePre={handlePre}
            handleSave={() => handleSave("")}
            setSelectStudent={setSelectStudent}
            selectStudent={selectStudent}
          />
        );
        break;
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
      let responseExam: any = undefined;
      if (filterModel.isAuto) {
        const promises = selectRandomQuestion.map(
          async (item) => await questionService.random(item)
        );
        const results = await Promise.all(promises);
        const array: string[] = results.flatMap((res) => res.data);
        responseExam = await examService.add({
          ...examModel,
          questionId: array,
        });
      } else {
        responseExam = await examService.add(examModel);
      }
      const responseQuestion = await examService.get(responseExam.data);
      const myExamPromises = selectStudent.map(async (element) => {
        const myExamModel: IMyExamModel = {
          examId: responseExam.data,
          answers: responseQuestion.data.question.map((item) => ({
            questionId: item._id,
            answer: [],
          })),
          userId: element,
        };
        return myExamService.add(myExamModel);
      });
      await Promise.all(myExamPromises);
      handleNavigate();
      toast.success("Tạo bài kiểm tra thành công");
    } else {
      await examService.update(id, examModel);
    }
  };
  const handleNavigate = () => {
    navigate("/exam");
  };
  console.log(selectRandomQuestion);
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
export default ExamCreate;
