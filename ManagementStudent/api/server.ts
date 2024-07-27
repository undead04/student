import express from 'express';
import { Request, Response, NextFunction } from "express";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import subjectRoute from '../routes/SubjectRoute';
import subjectDetailRoute from '../routes/SubjectDetailRoute'
import classRoomRoute from '../routes/ClassRoomRoute'
import studentRoute from '../Routes/StudentRoute'
import teacherRoute from '../Routes/TeacherRoute'
import teacherClassRoomRoute from '../routes/TeacherClassRoomRoute'
import ChangePasswordRoute from '../routes/ChangePasswordRoute'
import myHomeworkRoute from '../routes/MyHomeworkRoute'
import SystemRoute from '../routes/SystemRoute'
import questionRoute from '../routes/QuestionRoute'
import examRoute from '../routes/ExamRoute'
import homeworkRoute from '../routes/HomeworkRoute'
import myExamRoute from '../routes/MyExamRoute'
import loginRoute from '../routes/LoginRoute'
import roleRoute from '../routes/RoleRoute'
import moveStudentRoute from '../routes/MoveStudent'
import userRouter from '../routes/UserRouter'
import statisticalHomeworkRouter from '../routes/statisticalHomework'
import statisticalExamRouter from '../routes/statisticalExam'
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(bodyParser.json());
// Connect to MongoDB

mongoose.connect(process.env.MONGO_URL||"");
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // Thêm 'Authorization' vào danh sách các headers cho phép
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Thêm đầy đủ các phương thức HTTP
  next();
});
// Routes
// Define your routes here
app.use("/api/subject",subjectRoute)
app.use("/api/subjectDetail",subjectDetailRoute)
app.use("/api/classRoom",classRoomRoute)
app.use("/api/student",studentRoute)
app.use("/api/teacher",teacherRoute)
app.use("/api/teacherClassRoom",teacherClassRoomRoute)
app.use("/api/system",SystemRoute)
app.use("/api/changePassword",ChangePasswordRoute)
app.use("/api/question",questionRoute)
app.use("/api/exam",examRoute)
app.use("/api/homework",homeworkRoute)
app.use("/api/myExam",myExamRoute)
app.use("/api/login",loginRoute)
app.use("/api/myHomework",myHomeworkRoute)
app.use("/api/authorize",roleRoute)
app.use("/api/moveStudent",moveStudentRoute)
app.use("/api/user",userRouter)
app.use('/api/statiscalHomework',statisticalHomeworkRouter)
app.use('/api/statiscalExam',statisticalExamRouter)
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
