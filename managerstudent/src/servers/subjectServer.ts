import api from "./api";
import ResponseWrapper from "./responseWrapper";
import { IPage } from '../models/Page';
import { ISubjectDetail } from "./subjectDetailServer";
export interface ISubject {
  _id: string;
  name: string;
  create_at:Date;
}
export interface GroupedSubjectDetail {
  subject: ISubject;
  details: ISubjectDetail[];
}
export interface IListSubject{
  subject:ISubject[],
  page:IPage
}
export interface ISubjectModel {
  name: string;
}
const list = (
) => {
  // Gửi yêu cầu GET đến API
  return api.get<ResponseWrapper<IListSubject>>(api.url.subject).then((res) => res.data);
};
const get = (id: string) => {
  return api
    .get<ResponseWrapper<ISubject>>(`${api.url.subject}/${id}`)
    .then((res) => res.data);
};
const group = () => {
  return api
    .get<ResponseWrapper<GroupedSubjectDetail[]>>(`${api.url.subject}/groupBy`)
    .then((res) => res.data);
};
const add = (data: ISubjectModel) => {
  return api
    .post<ResponseWrapper<string>>(`${api.url.subject}`, data)
    .then((res) => res.data);
};
const update = (id:string,data: ISubjectModel) => {
  return api
    .put<ResponseWrapper<string>>(`${api.url.subject}/${id}`, data)
    .then((res) => res.data);
};
const remove = (id: string) => {
  return api
    .delete<ResponseWrapper<string>>(`${api.url.subject}/${id}`)
    .then((res) => res.data);
};

const subjectService = {
  list,
  get,
  add,
  update,
  remove,
  group
};
export default subjectService;
