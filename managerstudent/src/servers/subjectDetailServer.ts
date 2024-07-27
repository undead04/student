import api from "./api";
import ResponseWrapper from "./responseWrapper";
import { IPage } from '../models/Page';
import { ISubject } from "./subjectServer";
export interface ISubjectDetail {
  _id: string;
  grade: number;
  tableOfContents:string[]
  subject:ISubject,
  image:string,
}
export interface ISubjectDetailModel {
    subjectId:string,
    grade:number,
    tableOfContents:string[],
    image:string
}
const list = (
  subjectId?:string,
  grade?:string
) => {
  const params = new URLSearchParams();
  let url = api.url.subjectDetail;

  if (subjectId) {
    params.append("subjectId", String(subjectId));
  }
  if(grade){
    params.append("grade",grade)
  }
  // Thêm các tham số vào URL nếu chúng tồn tại
  if (params.toString()) {
    url += "?" + params.toString();
  }

  // Gửi yêu cầu GET đến API
  return api.get<ResponseWrapper<ISubjectDetail[]>>(url).then((res) => res.data);
};
const get = (id: string) => {
  return api
    .get<ResponseWrapper<ISubjectDetail>>(`${api.url.subjectDetail}/${id}`)
    .then((res) => res.data);
};
const add = (data: ISubjectDetailModel) => {
  return api
    .post<ResponseWrapper<string>>(`${api.url.subjectDetail}`, data)
    .then((res) => res.data);
};
const update = (id:string,data: ISubjectDetailModel) => {
  return api
    .put<ResponseWrapper<string>>(`${api.url.subjectDetail}/${id}`,data)
    .then((res) => res.data);
};
const remove = (id: string) => {
  return api
    .delete<ResponseWrapper<string>>(`${api.url.subjectDetail}/${id}`)
    .then((res) => res.data);
};
const subjectDetailService = {
  list,
  get,
  add,
  update,
  remove,
};
export default subjectDetailService;
