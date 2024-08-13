import api from "./api";
import ResponseWrapper from "./responseWrapper";
import { IPage } from '../models/Page';
import { ISubjectDetail } from "./subjectDetailServer";
import { IQuestion } from "./questionServer";
import { IClassRoom } from "./classServer";
import { Id } from "@reduxjs/toolkit/dist/tsHelpers";
import { IHomework } from "./homeworkServer";
import { IStudent } from "./studentServer";
export interface IMyHomework{
    _id: string;
    homework:IHomework,
    user:IStudent,
    create_at:Date,
    answers: {
      questionId:string;
      answer: string[];
     }[],
     status:boolean,
    
  
}
export interface IMyHomeworkModel {
    homeworkId:string,
    answers: {
        questionId:string;
        answer: string[];
      }[],
      userId:string

}
export interface IListMyHomework{
  myHomework:IMyHomework[],
    page:IPage
}
const list = (
    page?:number,
    pageSize?:number
) => {
  const params = new URLSearchParams();
    let url=api.url.MyHomework
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
  return api.get<ResponseWrapper<IListMyHomework>>(url).then((res) => res.data);
};
const get = (id: string) => {
  return api
    .get<ResponseWrapper<IMyHomework>>(`${api.url.MyHomework}/${id}`)
    .then((res) => res.data);
};
const add = (data: IMyHomeworkModel) => {
  return api
    .post<ResponseWrapper<string>>(`${api.url.MyHomework}`, data)
    .then((res) => res.data);
};
const update = (id:string,data: IMyHomeworkModel) => {
  return api
    .put<ResponseWrapper<string>>(`${api.url.MyHomework}/${id}`, data)
    .then((res) => res.data);
};
const remove = (id: string) => {
  return api
    .delete<ResponseWrapper<string>>(`${api.url.MyHomework}/${id}`)
    .then((res) => res.data);
};
const getListStudent=(subjectDetailId?:string,status?:boolean,page?:number,pageSize?:number)=>{
  const params = new URLSearchParams();
    let url=`${api.url.MyHomework}/student`
  if (subjectDetailId) {
    params.append("subjectDetailId", String(subjectDetailId));
  }
  if (status!=undefined) {
    params.append("status", String(status));
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
  return api.get<ResponseWrapper<IListMyHomework>>(url).then(res=>res.data)
}
const myHomeworkService = {
  list,
  get,
  add,
  update,
  remove,
    getListStudent
};
export default myHomeworkService;
