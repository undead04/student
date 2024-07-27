import api from "./api";
import ResponseWrapper from "./responseWrapper";
import { IPage } from '../models/Page';
export interface ISystem {
  _id: string;
  logo:string,
  name:string,
  schoolYear:string,
  semester:string,
  
}
export interface ISystemModel {
  logo:string,
  name:string,
  schoolYear:string,
  semester:string
}
const get = () => {
  return api
    .get<ResponseWrapper<ISystem>>(`${api.url.system}`)
    .then((res) => res.data);
};
const add = (data: ISystemModel) => {
  return api
    .post<ResponseWrapper<string>>(`${api.url.system}`, data)
    .then((res) => res.data);
};
const update = (id:string,data: ISystemModel) => {
  return api
    .put<ResponseWrapper<string>>(`${api.url.system}/${id}`, data)
    .then((res) => res.data);
};
const remove = (id: string) => {
  return api
    .delete<ResponseWrapper<string>>(`${api.url.system}/${id}`)
    .then((res) => res.data);
};
const SystemService = {
  get,
  add,
  update,
  remove,
};
export default SystemService;
