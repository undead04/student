import api from "./api";
import ResponseWrapper from "./responseWrapper";
import { IPage } from '../models/Page';
import { ISubjectDetail } from "./subjectDetailServer";
import { IQuestion } from "./questionServer";
import { IClassRoom } from "./classServer";
import { Id } from "@reduxjs/toolkit/dist/tsHelpers";
export interface IExam{
    _id: string;
    name:string,
   subjectDetail:ISubjectDetail
   classRoom:IClassRoom[],
   startDate:Date,
   endDate:Date,
   answerDate:Date,
   create_at:Date,
   questionId:string[],
}
export interface IExamModel {
    name:string,
    subjectDetailId:string,
    classRoomId:string[],
    startDate:Date,
    endDate:Date,
    questionId:string[],
    answerDate:Date,
    studentId:string[]
}
export interface IListExam{
    exam:IExam[],
    page:IPage
}

const list = (
  subjectId?:string,
  classRoomId?:string,
  from?:Date,
  to?:Date,
  page?:number,
  pageSize?:number
) => {
  const params = new URLSearchParams();
  let url = api.url.exam;
  if (subjectId) {
    params.append("subjectId", String(subjectId));
  }
  if (classRoomId) {
    params.append("classRoomId", String(classRoomId));
  }
  if (from) {
    params.append("from", String(from));
  }
  if (to) {
    params.append("to", String(to));
  }
  if (page) {
    params.append("page", String(page));
  }
  if (pageSize) {
    params.append("pageSize", String(pageSize));
  }

  // Thêm các tham số vào URL nếu chúng tồn tại
  if (params.toString()) {
    url += "?" + params.toString();
  }

  // Gửi yêu cầu GET đến API
  return api.get<ResponseWrapper<IListExam>>(url).then((res) => res.data);
};
const getTeacher = (
  subjectId?:string,
  classRoomId?:string,
  from?:Date,
  to?:Date,
  page?:number,
  pageSize?:number
) => {
  const params = new URLSearchParams();
  let url = `${api.url.exam}/teacher`;
  if (subjectId) {
    params.append("subjectId", String(subjectId));
  }
  if (classRoomId) {
    params.append("classRoomId", String(classRoomId));
  }
  if (from) {
    params.append("from", String(from));
  }
  if (to) {
    params.append("to", String(to));
  }
  if (page) {
    params.append("page", String(page));
  }
  if (pageSize) {
    params.append("pageSize", String(pageSize));
  }

  // Thêm các tham số vào URL nếu chúng tồn tại
  if (params.toString()) {
    url += "?" + params.toString();
  }

  // Gửi yêu cầu GET đến API
  return api.get<ResponseWrapper<IListExam>>(url).then((res) => res.data);
};
const get = (id: string) => {
  return api
    .get<ResponseWrapper<IExam>>(`${api.url.exam}/${id}`)
    .then((res) => res.data);
};
const add = (data: IExamModel) => {
  return api
    .post<ResponseWrapper<string>>(`${api.url.exam}`, data)
    .then((res) => res.data);
};
const update = (id:string,data: IExamModel) => {
  return api
    .put<ResponseWrapper<string>>(`${api.url.exam}/${id}`, data)
    .then((res) => res.data);
};
const remove = (id: string) => {
  return api
    .delete<ResponseWrapper<string>>(`${api.url.exam}/${id}`)
    .then((res) => res.data);
};
const examService = {
  list,
  get,
  add,
  update,
  remove,
  getTeacher
};
export default examService;
