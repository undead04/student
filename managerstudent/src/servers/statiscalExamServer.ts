import { url } from "inspector";
import api from "./api";
import ResponseWrapper from "./responseWrapper";
import { IMyExam } from "./myExamServer";
import { IPage } from "../models/Page";

export interface IStatiscalExam{
    done:number;
    unfinished:number;
    exam:IMyExam[];
    page:IPage;
}
const get=(id:string,classRoomId?:string,page?:number)=>{
    const params = new URLSearchParams();
  let url = `${api.url.statiscalExam}/${id}`;
  if (classRoomId) {
    params.append("classRoomId", String(classRoomId));
  }
  if(page){
    params.append("page",String(page))
  }
  if (params.toString()) {
    url += "?" + params.toString();
  }
    return api.get<ResponseWrapper<IStatiscalExam>>(url).then(res=>res.data)
}
const statiscalExamService={
    get
}
export default statiscalExamService