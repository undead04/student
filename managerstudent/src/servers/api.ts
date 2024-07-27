import axios from "axios";
import store,{RootState} from "../store";
const url = {
  baseUrl: "http://localhost:4000/api/",
  subjectDetail: "subjectDetail",
  subject: "subject",
  class: "classRoom",
  auth:"",
  student:"student",
  changePassword:"changePassword",
  teacher:"teacher",
  system:"system",
  teacherClassRoom:"teacherClassRoom",
  question:"question",
  exam:"exam",
  homework:"homework",
  MyHomework:"myHomework",
  myExam:"myExam",
  authorize:"authorize",
  moveStudent:'moveStudent',
  user:'user',
  statiscalHomework:"statiscalHomework",
  statiscalExam:'statiscalExam'
};
const content={
  json:"application/json",
  formData:"multipart/form-data"
}
const instance = axios.create({
  baseURL: url.baseUrl,
  headers: {
    "Content-Type": content.json,
    Accept: "application/json",
  },
});
instance.interceptors.request.use((request)=>{
  const state:RootState=store.getState();
  if(state.auth.token) {
    request.headers.Authorization=`Bearer ${state.auth.token}`
  }
  return request;
});

const api = {
  url,
  content,
  get: instance.get,
  post: instance.post,
  delete: instance.delete,
  put: instance.put,
  patch: instance.patch,
  
};
export default api;
