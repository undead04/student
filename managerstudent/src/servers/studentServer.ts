import api from "./api";
import ResponseWrapper from "./responseWrapper";
import { IPage } from '../models/Page';
import { ISubjectDetail } from "./subjectDetailServer";
import { IClassRoom } from "./classServer";
import { IUser } from "./userServer";
import { AxiosRequestConfig,AxiosResponse } from "axios";
export interface IStudent {
  _id:string;
  codeUser: string;
  name: string;
  email: string;
  dateOfBirth: Date;
  cccd: string;
  phone: string;
  address: string;
  create_at: Date;
  classRoom:IClassRoom
  user:IUser
  avatar:string,
  status:boolean,
  sex:number
}
export interface IListStudent {
  student: IStudent[];
  page: IPage;
}

export interface IStudentModel {
  codeUser:string;
  name:string,
  email:string,
  dateOfBirth:string,
  phone:string,
  classRoomId:string,
  cccd:string,
  address:string,
  username:string,
  password:string,
  sex:number
}
const list = (
  search?:string,
  page?:number,
  pageSize?:number,
  sortBy?:string,
  order?:string,
  classRoomId?:string
) => {
  let url=api.url.student;
  const params = new URLSearchParams();
  if(search){
    params.append("search",search)
  }
  if(classRoomId){
    params.append("classRoomId",classRoomId)
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
  return api.get<ResponseWrapper<IListStudent>>(url).then((res) => res.data);
};
const get = (id: string) => {
  return api
    .get<ResponseWrapper<IStudent>>(`${api.url.student}/${id}`)
    .then((res) => res.data);
};
const add = (data: IStudentModel) => {
  return api
    .post<ResponseWrapper<string>>(`${api.url.student}`, data)
    .then((res) => res.data);
};
const update = (id:string,data: IStudentModel) => {
  return api
    .put<ResponseWrapper<string>>(`${api.url.student}/${id}`, data)
    .then((res) => res.data);
};
const remove = (id: string) => {
  return api
    .delete<ResponseWrapper<string>>(`${api.url.student}/${id}`)
    .then((res) => res.data);
};
const download = (options?: AxiosRequestConfig) => {
  return api.get<any>(`${api.url.student}/export`, { ...options, responseType: 'blob' });
};
const studentService = {
  list,
  get,
  add,
  update,
  remove,
  download
};
export default studentService;
