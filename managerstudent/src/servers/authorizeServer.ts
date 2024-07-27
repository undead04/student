import api from "./api";
import ResponseWrapper from "./responseWrapper";

const put=(userId:string)=>{
    return api.put<ResponseWrapper<string>>(`${api.url.authorize}/${userId}`).then(res=>res.data)
}
const authorizeServices={
    put
}
export default authorizeServices