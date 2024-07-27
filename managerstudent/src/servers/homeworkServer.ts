import api from "./api";
import ResponseWrapper from "./responseWrapper";
import { IPage } from '../models/Page';
import { ISubjectDetail } from "./subjectDetailServer";
import { IQuestion } from "./questionServer";
import { IClassRoom } from "./classServer";
import { Id } from "@reduxjs/toolkit/dist/tsHelpers";
export interface IHomework{
    _id: string;
    name:string,
   subjectDetail:ISubjectDetail
   classRoom:IClassRoom[],
   startDate:Date,
   endDate:Date,
   create_at:Date,
   questionId:string[]
  
}
export interface IHomeworkModel {
    name:string,
    subjectDetailId:string,
    classRoomId:string[],
    startDate:string,
    endDate:string,
    questionId:string[],
    studentId:string[]
}
export interface IListHomework{
  homework:IHomework[],
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
  let url = api.url.homework;
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
  return api.get<ResponseWrapper<IListHomework>>(url).then((res) => res.data);
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
  let url = `${api.url.homework}/teacher`;
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
  return api.get<ResponseWrapper<IListHomework>>(url).then((res) => res.data);
};
const get = (id: string) => {
  return api
    .get<ResponseWrapper<IHomework>>(`${api.url.homework}/${id}`)
    .then((res) => res.data);
};
const add = (data: IHomeworkModel) => {
  return api
    .post<ResponseWrapper<string>>(`${api.url.homework}`, data)
    .then((res) => res.data);
};
const update = (id:string,data: IHomeworkModel) => {
  return api
    .put<ResponseWrapper<string>>(`${api.url.homework}/${id}`, data)
    .then((res) => res.data);
};
const remove = (id: string) => {
  return api
    .delete<ResponseWrapper<string>>(`${api.url.homework}/${id}`)
    .then((res) => res.data);
};
const homeworkService = {
  list,
  get,
  add,
  update,
  remove,
  getTeacher
};
export default homeworkService;
