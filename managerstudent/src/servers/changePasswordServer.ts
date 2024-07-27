import api from "./api";
import ResponseWrapper from "./responseWrapper";
import { IPage } from '../models/Page';
export interface PasswordModel{
    newPassword:string,
    comfimPassword:string
  }



const update = (id:string,data: PasswordModel) => {
  return api
    .put<ResponseWrapper<string>>(`${api.url.changePassword}/${id}`, data)
    .then((res) => res.data);
};
const changePasswordService = {

  update,

};
export default changePasswordService;
