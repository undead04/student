import * as React from "react";
import { useState } from "react";
import Header from "./Header";
import { Navigate, Route, Routes } from "react-router-dom";
import SubjectView from "../subject/SubjectView";
import GradeView from "../grade/GradeView";
import StudentView from "../students/StudentView";
import TeacherView from "../teacher/TeacherView";
import SystemView from "../system/SystemView";
import ClassTeacher from "../classTeacher/ClassTeacher";
import QuestionView from "../question/QuestionView";
import QuestionCreate from "../question/QuestionCreate";
import Homework from "../homework/Homework";
import HomeworkCreate from "../homework/HomeworkCreate";
import HomeworkDetail from "../homework/HomeworkDetail";
import ListExam from "../exam/ListExam";
import ExamCreate from "../exam/ExamCreate";
import ExamDetail from "../exam/ExamDetail";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import NotAuthorized from "./NotAuthorized";
import Home from "../home/Home";
import MyCourse from "../home/MyCourse";
import MyHomework from "../home/MyHomework";
import MyHomeworkDetail from "../home/MyHomeworkDetail";
import MoveStudent from "./../students/MoveStudent";
import DasboadHomework from "../home/DasboadHomework";
import Profile from "../home/Profile";
import Statistical from "../statistical/Statistical";
import RoleBasedRoute from "./RoleBasedRoute";

const Default = () => {
  const isLogin = useSelector((state: RootState) => state.auth.isLoggedIn);
  const role: string[] = useSelector(
    (start: RootState) => start.auth.userInfo?.user.role ?? []
  );
  const userRolesString = role.join();
  return (
    <>
      {isLogin ? (
        <>
          <Header />
          <Routes>
            <Route
              path="subject"
              element={
                <RoleBasedRoute
                  allowedRoles={["admin"]}
                  userRole={userRolesString}
                >
                  <SubjectView />
                </RoleBasedRoute>
              }
            />
            <Route
              path="home"
              element={
                <RoleBasedRoute
                  allowedRoles={["student"]}
                  userRole={userRolesString}
                >
                  <Home />
                </RoleBasedRoute>
              }
            />
            <Route
              path="grade"
              element={
                <RoleBasedRoute
                  allowedRoles={["admin"]}
                  userRole={userRolesString}
                >
                  <GradeView />
                </RoleBasedRoute>
              }
            />
            <Route
              path="student"
              element={
                <RoleBasedRoute
                  allowedRoles={["admin", "teacher"]}
                  userRole={userRolesString}
                >
                  <StudentView />
                </RoleBasedRoute>
              }
            />
            <Route
              path="teacher"
              element={
                <RoleBasedRoute
                  allowedRoles={["admin"]}
                  userRole={userRolesString}
                >
                  <TeacherView />
                </RoleBasedRoute>
              }
            />
            <Route
              path="system"
              element={
                <RoleBasedRoute
                  allowedRoles={["admin"]}
                  userRole={userRolesString}
                >
                  <SystemView />
                </RoleBasedRoute>
              }
            />
            <Route
              path="teacherClassRoom"
              element={
                <RoleBasedRoute
                  allowedRoles={["admin"]}
                  userRole={userRolesString}
                >
                  <ClassTeacher />
                </RoleBasedRoute>
              }
            />
            <Route
              path="question"
              element={
                <RoleBasedRoute
                  allowedRoles={["teacher", "admin"]}
                  userRole={userRolesString}
                >
                  <QuestionView />
                </RoleBasedRoute>
              }
            />
            <Route
              path="question/create"
              element={
                <RoleBasedRoute
                  allowedRoles={["teacher", "admin"]}
                  userRole={userRolesString}
                >
                  <QuestionCreate />
                </RoleBasedRoute>
              }
            />
            <Route
              path="question/edit/:id"
              element={
                <RoleBasedRoute
                  allowedRoles={["teacher", "admin"]}
                  userRole={userRolesString}
                >
                  <QuestionCreate />
                </RoleBasedRoute>
              }
            />
            <Route
              path="homework"
              element={
                <RoleBasedRoute
                  allowedRoles={["teacher", "admin"]}
                  userRole={userRolesString}
                >
                  <Homework />
                </RoleBasedRoute>
              }
            />
            <Route
              path="homework/create"
              element={
                <RoleBasedRoute
                  allowedRoles={["teacher", "admin"]}
                  userRole={userRolesString}
                >
                  <HomeworkCreate />
                </RoleBasedRoute>
              }
            />
            <Route
              path="homework/:id"
              element={
                <RoleBasedRoute
                  allowedRoles={["teacher", "admin"]}
                  userRole={userRolesString}
                >
                  <HomeworkDetail />
                </RoleBasedRoute>
              }
            />
            <Route
              path="exam"
              element={
                <RoleBasedRoute
                  allowedRoles={["teacher", "admin"]}
                  userRole={userRolesString}
                >
                  <ListExam />
                </RoleBasedRoute>
              }
            />
            <Route
              path="exam/create"
              element={
                <RoleBasedRoute
                  allowedRoles={["teacher", "admin"]}
                  userRole={userRolesString}
                >
                  <ExamCreate />
                </RoleBasedRoute>
              }
            />
            <Route
              path="exam/:id"
              element={
                <RoleBasedRoute
                  allowedRoles={["teacher", "admin"]}
                  userRole={userRolesString}
                >
                  <ExamDetail />
                </RoleBasedRoute>
              }
            />
            <Route path="not-authorized" element={<NotAuthorized />} />{" "}
            <Route
              path="myCourse/:id"
              element={
                <RoleBasedRoute
                  allowedRoles={["student"]}
                  userRole={userRolesString}
                >
                  <MyCourse />
                </RoleBasedRoute>
              }
            />
            <Route
              path="myHomework/:id"
              element={
                <RoleBasedRoute
                  allowedRoles={["student"]}
                  userRole={userRolesString}
                >
                  <MyHomework isExam={false} />
                </RoleBasedRoute>
              }
            />
            <Route
              path="myHomeworkDetail/:id"
              element={
                <RoleBasedRoute
                  allowedRoles={["student"]}
                  userRole={userRolesString}
                >
                  <MyHomeworkDetail isExam={false} isStatistical={false} />
                </RoleBasedRoute>
              }
            />
            <Route
              path="myExam/:id"
              element={
                <RoleBasedRoute
                  allowedRoles={["student"]}
                  userRole={userRolesString}
                >
                  <MyHomework isExam={true} />
                </RoleBasedRoute>
              }
            />
            <Route
              path="myExamDetail/:id"
              element={
                <RoleBasedRoute
                  allowedRoles={["student"]}
                  userRole={userRolesString}
                >
                  <MyHomeworkDetail isExam={true} isStatistical={false} />
                </RoleBasedRoute>
              }
            />
            <Route
              path="moveStudent"
              element={
                <RoleBasedRoute
                  allowedRoles={["admin"]}
                  userRole={userRolesString}
                >
                  <MoveStudent />
                </RoleBasedRoute>
              }
            />
            <Route
              path="dasboadHomework/:id"
              element={
                <RoleBasedRoute
                  allowedRoles={["student"]}
                  userRole={userRolesString}
                >
                  <DasboadHomework isExam={false} />
                </RoleBasedRoute>
              }
            />
            <Route
              path="dasboadExam/:id"
              element={
                <RoleBasedRoute
                  allowedRoles={["student"]}
                  userRole={userRolesString}
                >
                  <DasboadHomework isExam={true} />
                </RoleBasedRoute>
              }
            />
            <Route path="profile" element={<Profile />} />
            <Route
              path="statisticalHomework/:id"
              element={
                <RoleBasedRoute
                  allowedRoles={["admin", "teacher"]}
                  userRole={userRolesString}
                >
                  <Statistical isExam={false} />
                </RoleBasedRoute>
              }
            />
            <Route
              path="statisticalExam/:id"
              element={
                <RoleBasedRoute
                  allowedRoles={["admin", "teacher"]}
                  userRole={userRolesString}
                >
                  <Statistical isExam={true} />
                </RoleBasedRoute>
              }
            />
            <Route
              path="statisticalHomeworkDetail/:id"
              element={
                <RoleBasedRoute
                  allowedRoles={["admin", "teacher"]}
                  userRole={userRolesString}
                >
                  <MyHomeworkDetail isExam={false} isStatistical={true} />
                </RoleBasedRoute>
              }
            />
            <Route
              path="statisticalExamDetail/:id"
              element={
                <RoleBasedRoute
                  allowedRoles={["admin", "teacher"]}
                  userRole={userRolesString}
                >
                  <MyHomeworkDetail isExam={true} isStatistical={true} />
                </RoleBasedRoute>
              }
            />
          </Routes>
        </>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
};

export default Default;
