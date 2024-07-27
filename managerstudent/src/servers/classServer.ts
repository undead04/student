import api from "./api";
import ResponseWrapper from "./responseWrapper";
import { IPage } from '../models/Page';
export interface IClassRoom {
  _id: string;
  name: string;
  grade:string;
  homeroomTeacher:string
  
}
export interface IClassRoomModel {
  name: string;
  grade:string
}
const list = (
  grade?:string
) => {
  const params = new URLSearchParams();
  let url = api.url.class;
  if (grade) {
    params.append("grade", String(grade));
  }
  // Thêm các tham số vào URL nếu chúng tồn tại
  if (params.toString()) {
    url += "?" + params.toString();
  }

  // Gửi yêu cầu GET đến API
  return api.get<ResponseWrapper<IClassRoom[]>>(url).then((res) => res.data);
};
const get = (id: string) => {
  return api
    .get<ResponseWrapper<IClassRoom>>(`${api.url.class}/${id}`)
    .then((res) => res.data);
};
const add = (data: IClassRoomModel) => {
  return api
    .post<ResponseWrapper<string>>(`${api.url.class}`, data)
    .then((res) => res.data);
};
const update = (id:string,data: IClassRoomModel) => {
  return api
    .put<ResponseWrapper<string>>(`${api.url.class}/${id}`, data)
    .then((res) => res.data);
};
const remove = (id: string) => {
  return api
    .delete<ResponseWrapper<string>>(`${api.url.class}/${id}`)
    .then((res) => res.data);
};
const classService = {
  list,
  get,
  add,
  update,
  remove,
};
export default classService;
