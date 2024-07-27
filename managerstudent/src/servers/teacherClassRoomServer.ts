import api from "./api";
import ResponseWrapper from "./responseWrapper";
import { IPage } from '../models/Page';
import { IClassRoom } from "./classServer";
import { ITeacher } from "./teacherServer";
import { ISubjectDetail } from "./subjectDetailServer";
export interface ITeacherRoom {
  _id: string;
  classRoom:IClassRoom,
 teacher:ITeacher,
 subjectDetail:ISubjectDetail,
  
}
export interface IListTeacherRoom{
    teacherClassRoom:ITeacherRoom[],
    page:IPage
}
export interface ITeacherClassRoomModel {
  classRoomId:string,
  teacherId:string,
  subjectDetailId:string,
  
}
const list = (
    search?:string,
    page?:number,
    pageSize?:number,
    sortBy?:string,
    order?:string,
    classRoom?:string,
    
) => {
  const params = new URLSearchParams();
  let url = api.url.teacherClassRoom;
  if (search) {
    params.append("search", String(search));
  }
  if(classRoom){
    params.append("classRoom",classRoom)
  }
  
  if (page) {
    params.append("page", String(page));
  }
  if (pageSize) {
    params.append("pageSize", String(pageSize));
  }
  if (sortBy) {
    params.append("sortBy", String(sortBy));
  }
  if (order) {
    params.append("order", String(order));
  }
  // Thêm các tham số vào URL nếu chúng tồn tại
  if (params.toString()) {
    url += "?" + params.toString();
  }

  // Gửi yêu cầu GET đến API
  return api.get<ResponseWrapper<IListTeacherRoom>>(url).then((res) => res.data);
};
const get = (id: string) => {
  return api
    .get<ResponseWrapper<ITeacherRoom>>(`${api.url.teacherClassRoom}/${id}`)
    .then((res) => res.data);
};
const getStudent = (subjectDetailId?:string) => {
  let url=`${api.url.teacherClassRoom}/student`;
  const params = new URLSearchParams();
  if(subjectDetailId){
    params.append("subjectDetailId",subjectDetailId)
  }
  if (params.toString()) {
    url += "?" + params.toString();
  }
  return api
    .get<ResponseWrapper<ITeacherRoom[]>>(url)
    .then((res) => res.data);
};
const add = (data: ITeacherClassRoomModel) => {
  return api
    .post<ResponseWrapper<string>>(`${api.url.teacherClassRoom}`, data)
    .then((res) => res.data);
};
const update = (id:string,data: ITeacherClassRoomModel) => {
  return api
    .put<ResponseWrapper<string>>(`${api.url.teacherClassRoom}/${id}`, data)
    .then((res) => res.data);
};
const remove = (id: string) => {
  return api
    .delete<ResponseWrapper<string>>(`${api.url.teacherClassRoom}/${id}`)
    .then((res) => res.data);
};
const teacherClassRoomService = {
  list,
  get,
  add,
  update,
  remove,
  getStudent
};
export default teacherClassRoomService;
