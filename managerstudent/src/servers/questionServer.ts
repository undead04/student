import api from "./api";
import ResponseWrapper from "./responseWrapper";
import { IPage } from '../models/Page';
import { ISubject } from "./subjectServer";
import { ISubjectDetail } from "./subjectDetailServer";
export interface IQuestion {
  _id: string;
  question:string,
   option:string[],
   answer:string[],
   create_at:Date,
   subjectDetail:ISubjectDetail
   grade:string,
   tableOfContents:string,
   isMul:boolean,
   level:number
  
}
export interface IRandomQuestion{
  subjectDetailId:string,
  tableOfContents:string,
  numberLowQuestion:number,
  numberMediumQuestion:number,
  numberHightQuestion:number
}
export interface IListQuestion{
    question:IQuestion[],
    page:IPage
}
export interface IQuestionModel {
    question:string,
    option:string[],
    answer:string[],
    isMul:boolean,
    subjectDetailId:string,
    tableOfContents:string,
    level:number,
    subjectId:string,
    grade:string
}
const list = (
  search?:string,
  subjectId?:string,
  grade?:string,
  level?:string,
  tableOfContents?:string,
  sortBy?:string,
  order?:string,
  page?:string,
  pageSize?:number,
) => {
  const params = new URLSearchParams();
  let url = api.url.question;
  if (search) {
    params.append("search", String(search));
  }
  if(grade){
    params.append("grade",grade)
  }
  if (subjectId) {
    params.append("subjectId", String(subjectId));
  }
  if (tableOfContents) {
    params.append("tableOfContents", String(tableOfContents));
  }
  if (level) {
    params.append("level", String(level));
  }
  if (sortBy) {
    params.append("sortBy", String(sortBy));
  }
  if (order) {
    params.append("order", String(order));
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
  return api.get<ResponseWrapper<IListQuestion>>(url).then((res) => res.data);
};
const get = (id: string) => {
  return api
    .get<ResponseWrapper<IQuestion>>(`${api.url.question}/${id}`)
    .then((res) => res.data);
};
const add = (data: IQuestionModel) => {
  return api
    .post<ResponseWrapper<string>>(`${api.url.question}`, data)
    .then((res) => res.data);
};
const random=(data:IRandomQuestion)=>{
  const params = new URLSearchParams();
  let url = `${api.url.question}/random`;
  if (data.subjectDetailId) {
    params.append("subjectDetailId", String(data.subjectDetailId));
  }
  if(data.tableOfContents){
    params.append("tableOfContents",String(data.tableOfContents))
  }
  if (data.numberLowQuestion) {
    params.append("numberLowQuestion", String(data.numberLowQuestion));
  }
  if (data.numberMediumQuestion) {
    params.append("numberMediumQuestion", String(data.numberMediumQuestion));
  }
  if (data.numberHightQuestion) {
    params.append("numberHightQuestion", String(data.numberHightQuestion));
  }
  // Thêm các tham số vào URL nếu chúng tồn tại
  if (params.toString()) {
    url += "?" + params.toString();
  }
  return api.get<ResponseWrapper<string[]>>(url).then(res=>res.data)
}
const update = (id:string,data: IQuestionModel) => {
  return api
    .put<ResponseWrapper<string>>(`${api.url.question}/${id}`, data)
    .then((res) => res.data);
};
const remove = (id: string) => {
  return api
    .delete<ResponseWrapper<string>>(`${api.url.question}/${id}`)
    .then((res) => res.data);
};
const getTeacher = (
  search?:string,
  subjectId?:string,
  grade?:string,
  level?:string,
  tableOfContents?:string,
  sortBy?:string,
  order?:string,
  page?:string,
  pageSize?:number,
) => {
  const params = new URLSearchParams();
  let url = `${api.url.question}/teacher`;
  if (search) {
    params.append("search", String(search));
  }
  if(grade){
    params.append("grade",grade)
  }
  if (subjectId) {
    params.append("subjectId", String(subjectId));
  }
  if (tableOfContents) {
    params.append("tableOfContents", String(tableOfContents));
  }
  if (level) {
    params.append("level", String(level));
  }
  if (sortBy) {
    params.append("sortBy", String(sortBy));
  }
  if (order) {
    params.append("order", String(order));
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
  return api.get<ResponseWrapper<IListQuestion>>(url).then((res) => res.data);
};
const questionService = {
  list,
  get,
  add,
  update,
  remove,
  random,
  getTeacher
};
export default questionService;
