import api from "./api"
import ResponseWrapper from "./responseWrapper"

export interface IMoveStudentModel{
    studentId:string[],
    classRoomId:string,
}
const put=(data:IMoveStudentModel)=>{
    return api.put<ResponseWrapper<string>>(api.url.moveStudent,data).then(res=>res.data)
}
const moveStudentServer={
    put
}
export default moveStudentServer