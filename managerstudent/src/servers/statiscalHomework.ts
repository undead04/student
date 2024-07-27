import { url } from "inspector";
import api from "./api";
import { IHomework } from "./homeworkServer"
import ResponseWrapper from "./responseWrapper";
import { IMyHomework } from "./myHomeworkServer";

export interface IStatiscalHomework{
    done:number;
    unfinished:number;
    homework:IMyHomework[]
}
const get=(id:string,classRoomId?:string,page?:number)=>{
    const params = new URLSearchParams();
  let url = `${api.url.statiscalHomework}/${id}`;
  if (classRoomId) {
    params.append("classRoomId", String(classRoomId));
  }
  if(page){
    params.append("page",String(page))
  }
  if (params.toString()) {
    url += "?" + params.toString();
  }
    return api.get<ResponseWrapper<IStatiscalHomework>>(url).then(res=>res.data)
}
const statiscalHomeworkService={
    get
}
export default statiscalHomeworkService