import api from "./api";
import ResponseWrapper from "./responseWrapper";
import { IPage } from '../models/Page';
import { IStudent } from "./studentServer";
import { IExam } from "./examServer";
export interface IMyExam{
    _id: string;
    exam:IExam,
    user:IStudent,
    create_at:Date,
    answers: {
      questionId:string;
      answer: string[];
     }[],
    
}
export interface IMyExamModel {
    examId:string,
    answers: {
        questionId:string;
        answer: string[];
      }[],

}
export interface IListMyExam{
  myExam:IMyExam[],
    page:IPage
}
const list = (
    page?:number,
    pageSize?:number
) => {
  const params = new URLSearchParams();
    let url=api.url.myExam
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
  return api.get<ResponseWrapper<IListMyExam>>(url).then((res) => res.data);
};
const get = (id: string) => {
  return api
    .get<ResponseWrapper<IMyExam>>(`${api.url.myExam}/${id}`)
    .then((res) => res.data);
};
const add = (data: IMyExamModel) => {
  return api
    .post<ResponseWrapper<string>>(`${api.url.myExam}`, data)
    .then((res) => res.data);
};
const update = (id:string,data: IMyExamModel) => {
  return api
    .put<ResponseWrapper<string>>(`${api.url.myExam}/${id}`, data)
    .then((res) => res.data);
};
const remove = (id: string) => {
  return api
    .delete<ResponseWrapper<string>>(`${api.url.myExam}/${id}`)
    .then((res) => res.data);
};
const myExamService = {
  list,
  get,
  add,
  update,
  remove,
};
export default myExamService;
