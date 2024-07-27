import api from "./api";
import ResponseWrapper from "./responseWrapper";
import { IPage } from '../models/Page';
import { ISubjectDetail } from "./subjectDetailServer";
import { IClassRoom } from "./classServer";
import { IUser } from "./userServer";
import { AxiosRequestConfig,AxiosResponse } from "axios";
import { ISubject } from "./subjectServer";
export interface ITeacher {
  _id:string;
  codeUser: string;
  name: string;
  email: string;
  dateOfBirth: Date;
  cccd: string;
  phone: string;
  address: string;
  create_at: Date;
  user:IUser
  avatar:string,
  status:boolean,
  sex:number,
  subject:ISubject[]
}
export interface IListTeacher {
  teacher: ITeacher[];
  page: IPage;
}

export interface ITeacherModel {
  codeUser:string;
  name:string,
  email:string,
  dateOfBirth:string,
  phone:string,
  cccd:string,
  address:string,
  username:string,
  password:string,
  sex:number
  subjectId:string[]
}
const list = (
  search?:string,
  subjectId?:string,
  page?:number,
  pageSize?:number,
  sortBy?:string,
  order?:string,
) => {
  let url=api.url.teacher;
  const params = new URLSearchParams();
  if(search){
    params.append("search",search)
  }
  if(subjectId){
    params.append("subjectId",subjectId)
  }
  if(page){
    params.append("page",page.toString())
  }
  if(pageSize){
    params.append("pageSize",pageSize.toString())
  }
  if(sortBy){
    params.append("sortBy",sortBy)
  }
  if(order){
    params.append("order",order)
  }
  if (params.toString()) {
    url += "?" + params.toString();
  }
  // Gửi yêu cầu GET đến API
  return api.get<ResponseWrapper<IListTeacher>>(url).then((res) => res.data);
};
const get = (id: string) => {
  return api
    .get<ResponseWrapper<ITeacher>>(`${api.url.teacher}/${id}`)
    .then((res) => res.data);
};
const add = (data: ITeacherModel) => {
  return api
    .post<ResponseWrapper<string>>(`${api.url.teacher}`, data)
    .then((res) => res.data);
};
const update = (id:string,data: ITeacherModel) => {
  return api
    .put<ResponseWrapper<string>>(`${api.url.teacher}/${id}`, data)
    .then((res) => res.data);
};
const remove = (id: string) => {
  return api
    .delete<ResponseWrapper<string>>(`${api.url.teacher}/${id}`)
    .then((res) => res.data);
};
const download = (options?: AxiosRequestConfig) => {
  return api.get<any>(`${api.url.teacher}/export`, { ...options, responseType: 'blob' });
};
const teacherService = {
  list,
  get,
  add,
  update,
  remove,
  download
};
export default teacherService;
